import { useState } from "react";
import { Camera, Upload, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Layout from "@/components/Layout";

const ImageAnalysis = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Layout>
      <div className="px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="rounded-full"
          >
            <X className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">Image Analysis</h1>
        </div>

        {!selectedImage ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
            <div className="w-full max-w-md space-y-4">
              {/* Upload Area */}
              <label
                htmlFor="image-upload"
                className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors"
              >
                <Upload className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-muted-foreground">
                  PNG, JPG, GIF up to 10MB
                </p>
                <input
                  id="image-upload"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </label>

              {/* Camera Button */}
              <Button className="w-full h-14" size="lg">
                <Camera className="h-5 w-5 mr-2" />
                Take Photo
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Image Preview */}
            <div className="relative rounded-lg overflow-hidden bg-muted">
              <img
                src={selectedImage}
                alt="Selected"
                className="w-full h-auto max-h-96 object-contain"
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-4 right-4 rounded-full"
                onClick={() => setSelectedImage(null)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Query Input */}
            <div className="space-y-3">
              <label className="text-sm font-medium">
                Ask a question about this image (optional)
              </label>
              <Input
                placeholder="e.g., What's in this image?"
                className="h-12"
              />
            </div>

            {/* Analyze Button */}
            <Button className="w-full h-12" size="lg">
              Analyze Image
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ImageAnalysis;