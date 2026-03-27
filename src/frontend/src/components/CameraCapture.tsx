import { useCamera } from "@/camera/useCamera";
import { Button } from "@/components/ui/button";
import { Camera, RefreshCw } from "lucide-react";
import { useState } from "react";

interface CameraCaptureProps {
  onCapture: (base64: string) => void;
  capturedPhoto?: string;
  label?: string;
}

export default function CameraCapture({
  onCapture,
  capturedPhoto,
  label = "Face Photo",
}: CameraCaptureProps) {
  const {
    isActive,
    isLoading,
    error,
    startCamera,
    stopCamera,
    capturePhoto,
    videoRef,
    canvasRef,
  } = useCamera({
    facingMode: "user",
    width: 640,
    height: 480,
    quality: 0.85,
    format: "image/jpeg",
  });
  const [localPhoto, setLocalPhoto] = useState<string | undefined>(
    capturedPhoto,
  );

  const handleStart = async () => {
    setLocalPhoto(undefined);
    await startCamera();
  };

  const handleCapture = async () => {
    const file = await capturePhoto();
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      setLocalPhoto(base64);
      onCapture(base64);
      stopCamera();
    };
    reader.readAsDataURL(file);
  };

  const handleRetake = () => {
    setLocalPhoto(undefined);
    handleStart();
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-sm font-medium text-foreground">{label}</p>

      <div
        className="relative w-full max-w-xs overflow-hidden rounded-xl border-2 border-border bg-muted"
        style={{ minHeight: 220, aspectRatio: "4/3" }}
      >
        {localPhoto ? (
          <img
            src={localPhoto}
            alt="Captured"
            className="h-full w-full object-cover"
          />
        ) : (
          <>
            <video
              ref={videoRef}
              className="h-full w-full object-cover"
              playsInline
              muted
              style={{ display: isActive ? "block" : "none" }}
            />
            {!isActive && !isLoading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground">
                <Camera size={36} className="opacity-40" />
                <p className="text-xs">Camera off</p>
              </div>
            )}
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              </div>
            )}
          </>
        )}
        <canvas ref={canvasRef} className="hidden" />
      </div>

      {error && <p className="text-xs text-destructive">{error.message}</p>}

      <div className="flex gap-2">
        {!isActive && !localPhoto && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleStart}
            disabled={isLoading}
            data-ocid="camera.button"
          >
            <Camera size={14} className="mr-1" />
            Start Camera
          </Button>
        )}
        {isActive && (
          <Button
            type="button"
            size="sm"
            onClick={handleCapture}
            disabled={isLoading}
            className="bg-primary text-primary-foreground"
            data-ocid="camera.capture_button"
          >
            <Camera size={14} className="mr-1" />
            Capture Photo
          </Button>
        )}
        {localPhoto && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleRetake}
            data-ocid="camera.retake_button"
          >
            <RefreshCw size={14} className="mr-1" />
            Retake
          </Button>
        )}
      </div>
    </div>
  );
}
