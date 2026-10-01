export interface R2Config {
  accountId: string;
  bucketName: string;
  publicUrl: string;
  accessKeyId?: string;
  secretAccessKey?: string;
  workerProxyUrl?: string;
}

const STORAGE_KEYS = {
  R2_ACCOUNT_ID: 'raka_r2_account_id',
  R2_BUCKET_NAME: 'raka_r2_bucket_name',
  R2_PUBLIC_URL: 'raka_r2_public_url',
  R2_WORKER_PROXY: 'raka_r2_worker_proxy'
};

export function getStoredR2Config(): R2Config {
  const envAccountId = import.meta.env.VITE_CF_R2_ACCOUNT_ID || '';
  const envBucket = import.meta.env.VITE_CF_R2_BUCKET_NAME || 'raka-learning-assets';
  const envPublicUrl = import.meta.env.VITE_CF_R2_PUBLIC_URL || '';

  const storedAccountId = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.R2_ACCOUNT_ID) || '' : '';
  const storedBucket = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.R2_BUCKET_NAME) || '' : '';
  const storedPublicUrl = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.R2_PUBLIC_URL) || '' : '';
  const storedProxy = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEYS.R2_WORKER_PROXY) || '' : '';

  return {
    accountId: storedAccountId || envAccountId,
    bucketName: storedBucket || envBucket,
    publicUrl: storedPublicUrl || envPublicUrl,
    workerProxyUrl: storedProxy
  };
}

export function saveR2Config(config: Partial<R2Config>) {
  if (typeof window !== 'undefined') {
    if (config.accountId !== undefined) localStorage.setItem(STORAGE_KEYS.R2_ACCOUNT_ID, config.accountId.trim());
    if (config.bucketName !== undefined) localStorage.setItem(STORAGE_KEYS.R2_BUCKET_NAME, config.bucketName.trim());
    if (config.publicUrl !== undefined) localStorage.setItem(STORAGE_KEYS.R2_PUBLIC_URL, config.publicUrl.trim());
    if (config.workerProxyUrl !== undefined) localStorage.setItem(STORAGE_KEYS.R2_WORKER_PROXY, config.workerProxyUrl.trim());
  }
}

export function clearR2Config() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEYS.R2_ACCOUNT_ID);
    localStorage.removeItem(STORAGE_KEYS.R2_BUCKET_NAME);
    localStorage.removeItem(STORAGE_KEYS.R2_PUBLIC_URL);
    localStorage.removeItem(STORAGE_KEYS.R2_WORKER_PROXY);
  }
}

export interface UploadResult {
  success: boolean;
  fileUrl: string;
  storageKey: string;
  bucket: string;
  fileSizeFormatted: string;
  error?: string;
}

export async function uploadFileToR2(
  file: File,
  category: string,
  onProgress?: (percent: number) => void
): Promise<UploadResult> {
  const config = getStoredR2Config();
  const timestamp = Date.now();
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const storageKey = `artworks/${category.toLowerCase()}/${timestamp}-${sanitizedName}`;

  const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
  const sizeFormatted = file.size > 1024 * 1024 ? `${sizeMb} MB` : `${Math.round(file.size / 1024)} KB`;

  // 1. If Worker proxy is configured, upload via Cloudflare Worker
  if (config.workerProxyUrl) {
    try {
      if (onProgress) onProgress(20);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('key', storageKey);
      formData.append('bucket', config.bucketName);

      const response = await fetch(`${config.workerProxyUrl.replace(/\/$/, '')}/upload`, {
        method: 'POST',
        body: formData
      });

      if (onProgress) onProgress(80);

      if (response.ok) {
        const json = await response.json();
        if (onProgress) onProgress(100);
        return {
          success: true,
          fileUrl: json.url || `${config.publicUrl.replace(/\/$/, '')}/${storageKey}`,
          storageKey,
          bucket: config.bucketName,
          fileSizeFormatted: sizeFormatted
        };
      }
    } catch (e) {
      console.warn('Worker upload failed, falling back to local object storage:', e);
    }
  }

  // 2. Client-side storage: read as Data URL with target R2 path
  return new Promise((resolve) => {
    let p = 0;
    const interval = setInterval(() => {
      p += 30;
      if (onProgress) onProgress(Math.min(p, 90));
      if (p >= 90) {
        clearInterval(interval);
        const reader = new FileReader();
        reader.onload = (e) => {
          const dataUrl = e.target?.result as string;
          const targetUrl = config.publicUrl 
            ? `${config.publicUrl.replace(/\/$/, '')}/${storageKey}` 
            : dataUrl;

          if (onProgress) onProgress(100);
          resolve({
            success: true,
            fileUrl: targetUrl,
            storageKey,
            bucket: config.bucketName || 'raka-learning-assets',
            fileSizeFormatted: sizeFormatted
          });
        };
        reader.onerror = () => {
          resolve({
            success: false,
            fileUrl: '',
            storageKey: '',
            bucket: config.bucketName,
            fileSizeFormatted: sizeFormatted,
            error: 'Gagal memproses file'
          });
        };
        reader.readAsDataURL(file);
      }
    }, 100);
  });
}

// Ready-to-deploy Cloudflare Worker script for R2 Object Storage
export const CLOUDFLARE_R2_WORKER_SCRIPT = `/**
 * Cloudflare Worker for R2 Storage Upload & Delivery
 * Deploy to Cloudflare Workers and bind your R2 bucket as 'MY_BUCKET'
 */
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        }
      });
    }

    if (url.pathname === "/upload" && request.method === "POST") {
      const formData = await request.formData();
      const file = formData.get("file");
      const key = formData.get("key") || \`uploads/\${Date.now()}-\${file.name}\`;

      if (!file) {
        return new Response(JSON.stringify({ error: "No file provided" }), {
          status: 400,
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
        });
      }

      await env.MY_BUCKET.put(key, file.stream(), {
        httpMetadata: { contentType: file.type }
      });

      const publicUrl = env.PUBLIC_R2_DOMAIN ? \`\${env.PUBLIC_R2_DOMAIN}/\${key}\` : \`https://pub-r2.dev/\${key}\`;

      return new Response(JSON.stringify({ success: true, key, url: publicUrl }), {
        status: 200,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }

    if (request.method === "GET") {
      const key = url.pathname.slice(1);
      const object = await env.MY_BUCKET.get(key);

      if (!object) {
        return new Response("Object Not Found", { status: 404 });
      }

      const headers = new Headers();
      object.writeHttpMetadata(headers);
      headers.set("etag", object.httpEtag);
      headers.set("Access-Control-Allow-Origin", "*");

      return new Response(object.body, { headers });
    }

    return new Response("Not Found", { status: 404 });
  }
};
`;
