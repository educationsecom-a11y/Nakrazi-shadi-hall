import { ChangeEvent, useState } from 'react';
import { Image as ImageIcon, Upload } from 'lucide-react';
import { compressImageFileToDataUrl } from '../../lib/imageUtils';
import { VenueImage } from '../VenueImage';

interface ImageFieldInputProps {
  label: string;
  value: string;
  onChange: (nextUrl: string) => void;
  previewAlt?: string;
}

export function ImageFieldInput({
  label,
  value,
  onChange,
  previewAlt = 'Preview',
}: ImageFieldInputProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError('');
    try {
      const compressed = await compressImageFileToDataUrl(file);
      onChange(compressed);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Failed to process image.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold text-[#1E1E1E]">{label}</label>
      <div className="flex flex-col sm:flex-row gap-3 items-start">
        <div className="w-28 h-20 rounded-lg overflow-hidden border border-[#E5E2E1] bg-[#0B3B2E] shrink-0">
          {value ? (
            <VenueImage src={value} alt={previewAlt} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#D4AF37]">
              <ImageIcon className="w-5 h-5" />
            </div>
          )}
        </div>

        <div className="flex-1 w-full space-y-2">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Paste image URL (https://...) or upload a photo below"
            className="w-full h-10 px-3 rounded-lg border border-[#D8D3C8] bg-[#FAF7F2] text-xs text-[#1E1E1E] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
          />

          <div className="flex flex-wrap items-center gap-2">
            <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white border border-[#0B3B2E]/25 hover:border-[#0B3B2E] text-xs font-semibold text-[#0B3B2E] cursor-pointer transition-colors">
              <Upload className="w-3.5 h-3.5" />
              <span>{uploading ? 'Optimizing...' : 'Upload Image File'}</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={uploading}
                className="sr-only"
              />
            </label>
            <span className="text-[11px] text-[#525B57]">
              JPG / PNG / WebP auto-optimized for fast loading
            </span>
          </div>

          {uploadError && <p className="text-xs text-red-700">{uploadError}</p>}
        </div>
      </div>
    </div>
  );
}
