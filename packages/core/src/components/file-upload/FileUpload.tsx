import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, DragEvent, ReactNode } from "react";
import { cn } from "../../utils/cn";
import { FieldLayout } from "../_internal/FieldLayout";
import type { FieldOrientation } from "../_internal/FieldLayout";
import { CloseIcon } from "../icon/CloseIcon";
import { DocumentIcon } from "../icon/DocumentIcon";
import { DocumentUploadIcon } from "../icon/DocumentUploadIcon";

/** 파일을 받지 못한 이유 */
export type FileRejectReason =
  /** `accept`에 없는 형식 */
  | "type"
  /** `maxSize`보다 큼 */
  | "size"
  /** `maxFiles`를 넘음 */
  | "count";

export interface FileRejection {
  file: File;
  reason: FileRejectReason;
}

export interface FileUploadProps {
  /** 선택된 파일 (제어 모드) */
  value?: File[];
  /** 처음 파일 (비제어 모드) */
  defaultValue?: File[];
  /** 받아들인 파일 목록이 바뀔 때(추가·교체·삭제) 호출된다. 서버로 올리는 일은 앱이 한다. */
  onChange?: (files: File[]) => void;
  /**
   * 받지 못한 파일이 있을 때 호출된다. 기본 안내 문구를 직접 만들려면 여기서 문구를 정해 `error`로 넘긴다.
   * 받지 못한 파일은 목록에 들어가지 않으므로 **이미 올린 파일은 그대로 유지**된다.
   */
  onReject?: (rejections: FileRejection[]) => void;
  /**
   * 허용 형식. `<input accept>`와 같은 쉼표 목록이다(`"image/png,image/jpeg,.webp"`, `"image/*"`).
   * 선택 창에서 걸러 줄 뿐 아니라 끌어다 놓은 파일도 같은 규칙으로 검사한다. 생략하면 모든 형식.
   */
  accept?: string;
  /** 파일 하나의 최대 크기(byte). 넘으면 받지 않는다. */
  maxSize?: number;
  /**
   * 최대 파일 개수. 기본 1(단일)이며, 단일이면 새 파일이 기존 파일을 **교체**한다.
   * 2 이상이면 파일이 추가되고, 가득 차면 더 받지 않는다.
   */
  maxFiles?: number;
  /** 올릴 수 있는 파일 안내 문구. 생략하면 `accept`와 `maxSize`로 만든다(예: "JPG, PNG, WebP · 최대 10MB"). */
  hint?: ReactNode;
  /** 이미지 파일의 미리보기 썸네일을 보여 줄지. 기본 `true` */
  preview?: boolean;
  /** 폼 제출용 이름. 선택된 파일이 같은 이름의 `<input type="file">`로 제출된다. */
  name?: string;
  id?: string;
  /** 라벨. 생략하면 라벨 영역이 렌더링되지 않는다. */
  label?: ReactNode;
  /** 라벨 배치. vertical은 라벨이 위, horizontal은 라벨이 왼쪽에 놓인다. */
  orientation?: FieldOrientation;
  /** 가로 배치일 때 라벨 영역의 너비(px) */
  labelWidth?: number;
  /** 필수 표시(`*`) */
  required?: boolean;
  /** 영역 아래 설명(도움말). 에러가 있으면 에러 메시지가 설명을 대신해 표시된다. */
  description?: ReactNode;
  /**
   * 에러 메시지. 주면 이 문구를 보여 준다. 생략하면 받지 못한 파일이 있을 때 컴포넌트가
   * 기본 안내("PNG 형식만 올릴 수 있어요" 등)를 대신 보여 주고, 다음 선택 때 지운다.
   */
  error?: ReactNode;
  disabled?: boolean;
  /** 라벨·영역·보조 문구를 모두 감싸는 컨테이너의 클래스. `className`은 끌어다 놓는 영역에 적용된다. */
  containerClassName?: string;
  className?: string;
}

const REASON_MESSAGE: Record<
  FileRejectReason,
  (detail: { accept: string; max: string }) => string
> = {
  type: ({ accept }) => `${accept} 형식만 올릴 수 있어요.`,
  size: ({ max }) => `파일 하나당 ${max} 이하만 올릴 수 있어요.`,
  count: () => "더 올릴 수 없어요. 파일을 삭제한 뒤 다시 시도해 주세요.",
};

function parseAccept(accept: string | undefined) {
  return (accept ?? "")
    .split(",")
    .map((token) => token.trim().toLowerCase())
    .filter(Boolean);
}

function matchesAccept(file: File, tokens: string[]) {
  if (tokens.length === 0) {
    return true;
  }
  const name = file.name.toLowerCase();
  const type = file.type.toLowerCase();
  return tokens.some((token) => {
    if (token.startsWith(".")) {
      return name.endsWith(token);
    }
    if (token.endsWith("/*")) {
      return type.startsWith(token.slice(0, -1));
    }
    return type === token;
  });
}

/** `image/jpeg` → "JPEG", `.webp` → "WebP", `image/*` → "이미지" */
function describeAccept(tokens: string[]) {
  const labels = tokens.map((token) => {
    if (token === "image/*") {
      return "이미지";
    }
    const ext = token.startsWith(".") ? token.slice(1) : token.slice(token.indexOf("/") + 1);
    if (ext === "*") {
      return token.slice(0, token.indexOf("/")).toUpperCase();
    }
    return ext === "webp" ? "WebP" : ext.toUpperCase();
  });
  return [...new Set(labels)].join(", ");
}

function formatBytes(bytes: number) {
  if (bytes >= 1024 * 1024) {
    return `${Number((bytes / 1024 / 1024).toFixed(1))}MB`;
  }
  if (bytes >= 1024) {
    return `${Math.round(bytes / 1024)}KB`;
  }
  return `${bytes}B`;
}

const sameFile = (a: File, b: File) =>
  a.name === b.name && a.size === b.size && a.lastModified === b.lastModified;

/** 이미지 파일의 미리보기 썸네일. object URL은 컴포넌트가 사라질 때 해제한다. */
function FileThumbnail({ file, preview }: { file: File; preview: boolean }) {
  const [url, setUrl] = useState<string | null>(null);
  const isImage = preview && file.type.startsWith("image/");

  useEffect(() => {
    if (!isImage) {
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setUrl(objectUrl);
    return () => {
      URL.revokeObjectURL(objectUrl);
      setUrl(null);
    };
  }, [file, isImage]);

  return (
    <span className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-8 bg-bg-page text-text-icon-default">
      {url ? (
        <img src={url} alt="" className="size-full object-cover" />
      ) : (
        <DocumentIcon size={20} />
      )}
    </span>
  );
}

/**
 * 파일 선택 + 끌어다 놓기 영역. 형식(`accept`)·크기(`maxSize`)·개수(`maxFiles`)를 검사해서 통과한 파일만
 * 목록에 넣고, 통과하지 못한 파일은 안내만 띄우므로 기존 파일은 그대로 남는다. 서버 업로드는 하지 않는다.
 * 단일(`maxFiles=1`)이면 새 파일이 기존 파일을 교체한다.
 */
export function FileUpload({
  value,
  defaultValue = [],
  onChange,
  onReject,
  accept,
  maxSize,
  maxFiles = 1,
  hint,
  preview = true,
  name,
  id,
  label,
  orientation,
  labelWidth,
  required,
  description,
  error,
  disabled,
  containerClassName,
  className,
}: FileUploadProps) {
  const [innerFiles, setInnerFiles] = useState<File[]>(defaultValue);
  const files = value ?? innerFiles;
  const [rejectMessage, setRejectMessage] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const dragDepth = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const single = maxFiles <= 1;
  const tokens = parseAccept(accept);
  const full = !single && files.length >= maxFiles;
  const inactive = disabled || full;

  // 폼 제출용: <input>의 files를 받아들인 파일 목록과 항상 같게 맞춘다(끌어다 놓은 파일 포함, 거절한 파일 제외)
  const syncInput = (list: File[]) => {
    const input = inputRef.current;
    if (!input) {
      return;
    }
    try {
      const transfer = new DataTransfer();
      list.forEach((file) => transfer.items.add(file));
      input.files = transfer.files;
    } catch {
      // DataTransfer를 만들 수 없는 환경에서는 제출용 동기화만 건너뛴다
    }
  };
  useEffect(() => syncInput(files), [files]);

  const commit = (next: File[]) => {
    if (value === undefined) {
      setInnerFiles(next);
    }
    onChange?.(next);
  };

  const addFiles = (incoming: File[]) => {
    if (inactive || incoming.length === 0) {
      return;
    }
    const rejections: FileRejection[] = [];
    const accepted: File[] = [];
    // 단일이면 여러 개를 놓아도 첫 파일만 보고 나머지는 개수 초과로 돌려보낸다
    const capacity = single ? 1 : maxFiles - files.length;
    for (const file of incoming) {
      if (!single && files.some((existing) => sameFile(existing, file))) {
        continue;
      }
      if (!matchesAccept(file, tokens)) {
        rejections.push({ file, reason: "type" });
      } else if (maxSize !== undefined && file.size > maxSize) {
        rejections.push({ file, reason: "size" });
      } else if (accepted.length >= capacity) {
        rejections.push({ file, reason: "count" });
      } else {
        accepted.push(file);
      }
    }

    if (rejections.length > 0) {
      const first = rejections[0].reason;
      setRejectMessage(
        REASON_MESSAGE[first]({
          accept: describeAccept(tokens),
          max: formatBytes(maxSize ?? 0),
        }),
      );
      onReject?.(rejections);
    } else {
      setRejectMessage(null);
    }
    if (accepted.length > 0) {
      commit(single ? accepted : [...files, ...accepted]);
    }
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    addFiles(Array.from(event.target.files ?? []));
    // 거절한 파일이 <input>에 남지 않게, 변경이 없더라도 현재 목록으로 되돌려 둔다
    syncInput(files);
  };

  const removeFile = (target: File) => {
    setRejectMessage(null);
    commit(files.filter((file) => file !== target));
  };

  const handleDragEnter = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    dragDepth.current += 1;
    if (!inactive) {
      setDragging(true);
    }
  };
  const handleDragLeave = () => {
    dragDepth.current = Math.max(dragDepth.current - 1, 0);
    if (dragDepth.current === 0) {
      setDragging(false);
    }
  };
  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    dragDepth.current = 0;
    setDragging(false);
    addFiles(Array.from(event.dataTransfer.files));
  };

  const autoHint = [describeAccept(tokens), maxSize !== undefined && `최대 ${formatBytes(maxSize)}`]
    .filter(Boolean)
    .join(" · ");
  const hintContent = hint ?? (autoHint || undefined);

  return (
    <FieldLayout
      label={label}
      orientation={orientation}
      labelWidth={labelWidth}
      required={required}
      description={description}
      error={error ?? rejectMessage}
      id={id}
      containerClassName={containerClassName}
      // 가로 배치에서 라벨은 끌어다 놓는 영역의 위쪽에 맞춘다
      labelAlign="first-row"
    >
      {(field) => (
        <div className="flex flex-col gap-2">
          <label
            onDragEnter={handleDragEnter}
            onDragOver={(event) => event.preventDefault()}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
              "flex flex-col items-center justify-center gap-1.5 rounded-12 border border-dashed bg-bg-page px-4 py-6 text-center font-fds transition-colors",
              inactive
                ? "cursor-not-allowed opacity-50"
                : "cursor-pointer hover:border-brand-primary",
              dragging ? "border-brand-primary bg-bg-blue-tint" : "border-border-strong",
              field.invalid && "border-brand-error",
              // 키보드로 <input>에 포커스가 가면 영역에 링을 보여 준다
              "has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brand-primary/40",
              className,
            )}
          >
            <input
              ref={inputRef}
              id={field.id}
              type="file"
              name={name}
              accept={accept}
              multiple={!single}
              required={required && files.length === 0}
              disabled={inactive}
              aria-invalid={field.invalid || undefined}
              aria-describedby={field.describedBy}
              onChange={handleInputChange}
              className="sr-only"
            />
            <DocumentUploadIcon size={24} className="text-text-icon-default" />
            <span className="text-sm text-text-primary">
              {full
                ? "더 이상 올릴 수 없어요"
                : single && files.length > 0
                  ? "다른 파일을 끌어다 놓거나 클릭해서 교체"
                  : "파일을 끌어다 놓거나 클릭해서 선택"}
            </span>
            {hintContent && <span className="text-caption-2 text-text-caption">{hintContent}</span>}
          </label>
          {files.length > 0 && (
            <ul className="m-0 flex list-none flex-col gap-1.5 p-0">
              {files.map((file) => (
                <li
                  key={`${file.name}-${file.size}-${file.lastModified}`}
                  className="flex items-center gap-3 rounded-10 border border-border-line bg-bg-surface p-2"
                >
                  <FileThumbnail file={file} preview={preview} />
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate font-fds text-sm text-text-primary">{file.name}</span>
                    <span className="font-fds text-caption-2 text-text-caption">
                      {formatBytes(file.size)}
                    </span>
                  </span>
                  <button
                    type="button"
                    aria-label={`${file.name} 삭제`}
                    disabled={disabled}
                    onClick={() => removeFile(file)}
                    className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-text-icon-default hover:bg-bg-page disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <CloseIcon size={16} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </FieldLayout>
  );
}
