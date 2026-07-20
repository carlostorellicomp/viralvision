import { VideoMetadata } from '../types';

/**
 * Extracts frames from a video file at regular intervals.
 * This simulates the backend 'ffmpeg' process but runs client-side to
 * prepare the payload for Gemini Vision.
 */
export const extractFramesFromVideo = async (
  file: File,
  intervalSeconds: number = 2.0,
  maxFrames: number = 20
): Promise<{ frames: string[]; metadata: VideoMetadata }> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const frames: string[] = [];
    const url = URL.createObjectURL(file);

    video.src = url;
    video.muted = true;
    video.playsInline = true;
    video.crossOrigin = 'anonymous';

    video.onloadedmetadata = () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
    };

    video.onerror = (e) => {
      URL.revokeObjectURL(url);
      reject("Erro ao carregar o arquivo de vídeo");
    };

    video.onloadeddata = async () => {
      const duration = video.duration;
      const step = Math.max(duration / maxFrames, intervalSeconds);
      let currentTime = 0;

      const captureFrame = async () => {
        if (currentTime > duration || frames.length >= maxFrames) {
          URL.revokeObjectURL(url);
          resolve({
            frames,
            metadata: {
              duration,
              width: video.videoWidth,
              height: video.videoHeight,
              frameCount: frames.length,
            },
          });
          return;
        }

        // Seek to time
        video.currentTime = currentTime;
      };

      video.onseeked = () => {
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          // Compress strictly to keep payload size reasonable for API
          const base64 = canvas.toDataURL('image/jpeg', 0.6); 
          frames.push(base64.split(',')[1]); // Remove data:image/jpeg;base64, prefix
          currentTime += step;
          captureFrame();
        } else {
          reject("Não foi possível criar o contexto do canvas");
        }
      };

      // Start capture loop
      captureFrame();
    };
  });
};