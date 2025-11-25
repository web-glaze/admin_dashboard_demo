"use client"

import { useState, useRef } from "react";
import Image from "next/image"; // Import the Next.js Image component
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Camera, Upload, X, Link, ImageIcon } from 'lucide-react';
import { CreateUserData } from "@/types/user";

interface AdditionalInfoSectionProps {
  formData: CreateUserData;
  onInputChange: (field: keyof CreateUserData, value: string) => void;
  onFieldBlur: (field: keyof CreateUserData) => void;
  getFieldError: (field: string) => string;
}

export function AdditionalInfoSection({ 
  formData, 
  onInputChange, 
  onFieldBlur, 
}: AdditionalInfoSectionProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [uploadMethod, setUploadMethod] = useState<'file' | 'url'>('file');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        return;
      }
      if (!file.type.startsWith('image/')) {
        alert("Please select a valid image file");
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setSelectedImage(imageUrl);
        setImagePreview(imageUrl);
        onInputChange("imageUrl", imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUrlChange = (url: string) => {
    onInputChange("imageUrl", url);
    setImagePreview(url);
    setSelectedImage(null);
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    onInputChange("imageUrl", "");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const currentImageUrl = imagePreview || formData.imageUrl;
  // Fallback image URL for when there's an error or no image
  const fallbackImageUrl = "https://avatar.iran.liara.run/public";
  const displayImage = currentImageUrl || fallbackImageUrl;

  return (
    <div className="space-y-6 bg-gradient-to-br from-orange-50/50 to-orange-100/20 dark:from-orange-950/10 dark:to-orange-900/5 p-6 rounded-xl border border-orange-200/30 dark:border-orange-800/20 shadow-sm">
      <div className="flex items-center gap-3 pb-3">
        <div className="p-2.5 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
          <Camera className="size-5 text-orange-600 dark:text-orange-400" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Additional Information</h3>
      </div>
      <Separator className="bg-orange-200/40 dark:bg-orange-800/30" />
      
      <div className="space-y-6">
        <div className="space-y-4">
          <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">Profile Image</Label>
          
          <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
            <button
              type="button"
              onClick={() => setUploadMethod('file')}
              className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-all duration-200 ${
                uploadMethod === 'file' 
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Upload className="size-4 inline mr-2" />
              Upload File
            </button>
            <button
              type="button"
              onClick={() => setUploadMethod('url')}
              className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-all duration-200 ${
                uploadMethod === 'url' 
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Link className="size-4 inline mr-2" />
              Image URL
            </button>
          </div>
          
          <div className="flex items-start gap-6">
            <div className="relative">
              <div className="w-28 h-28 rounded-xl overflow-hidden border-2 border-orange-200 dark:border-orange-800 shadow-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                {currentImageUrl ? (
                  <Image
                    src={displayImage}
                    alt="Profile preview"
                    width={112} // width of the container (w-28)
                    height={112} // height of the container (h-28)
                    className="object-cover"
                    onError={(e) => {
                      // This fallback logic is less common with next/image, but can be kept for robustness
                      const target = e.target as HTMLImageElement;
                      target.src = fallbackImageUrl;
                    }}
                  />
                ) : (
                  <ImageIcon className="size-8 text-slate-400 dark:text-slate-500" />
                )}
              </div>
              {currentImageUrl && (
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-sm"
                >
                  <X className="size-3" />
                </button>
              )}
            </div>
            
            <div className="flex-1 space-y-3">
              {uploadMethod === 'file' ? (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 h-10"
                  >
                    <Upload className="size-4" />
                    Choose Image
                  </Button>
                  <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1">
                    <p>• JPG, PNG or GIF (max 5MB)</p>
                    <p>• Recommended: 400x400px or larger</p>
                    <p>• Square images work best</p>
                  </div>
                </>
              ) : (
                <div className="space-y-2">
                  <Input
                    placeholder="https://example.com/profile-image.jpg"
                    value={formData.imageUrl}
                    onChange={(e) => handleImageUrlChange(e.target.value)}
                    onBlur={() => onFieldBlur("imageUrl")}
                    className="h-10"
                  />
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Paste a direct link to an image
                  </p>
                </div>
              )}
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
          />
        </div>

        {currentImageUrl && (
          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-900 dark:text-blue-200 mb-2">Image Quality Tips</h4>
            <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
              <li>• Use a professional headshot for best results</li>
              <li>• Ensure good lighting and clear visibility</li>
              <li>• Avoid sunglasses or face coverings</li>
              <li>• Square aspect ratio works best for profile pictures</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
