"use client";

import { useState, useRef, type FormEvent, type ChangeEvent } from "react";
import { Send, ImageIcon, X } from "lucide-react";
import Image from "next/image";

interface MessageInputProps {
  onSendMessage: (message: { text: string; image?: string | null }) => void;
  placeholder?: string;
  disabled?: boolean;
}

const MessageInput = ({
  onSendMessage,
  placeholder = "Type a message...",
  disabled = false,
}: MessageInputProps) => {
  const [text, setText] = useState<string>("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    onSendMessage({
      text: text.trim(),
      image: imagePreview,
    });

    // Clear form
    setText("");
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className=" relative bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 ">
      {/* Image Preview */}
      {imagePreview && (
        <div className="p-3 absolute  -top-[104px] -left-3 rounded-md">
          <div className="relative inline-block">
            <Image
              src={imagePreview || "/placeholder.svg"}
              alt="Preview"
              className="w-24 h-24 object-cover rounded-md border border-gray-300 dark:border-gray-700"
              height={300}
              width={300}
            />
            <button
              onClick={removeImage}
              className="absolute -top-2 -right-2 bg-white dark:bg-gray-800 rounded-full p-1 shadow-md border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              type="button"
              aria-label="Remove image"
            >
              <X className="h-4 w-4 text-gray-700 dark:text-gray-300" />
            </button>
          </div>
        </div>
      )}
   

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex items-center p-2">
        <button
          type="button"
          className="p-2 rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
          aria-label="Attach image"
        >
          <ImageIcon className="h-5 w-5" />
        </button>

        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleImageChange}
          disabled={disabled}
        />

        <input
          type="text"
          className="flex-1 mx-2 py-2 px-3 w-full md:w-[80%] bg-gray-100 dark:bg-gray-800 border-none rounded-full focus:outline-none focus:ring-2 focus:ring-primary dark:text-gray-100"
          placeholder={placeholder}
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={disabled}
        />

        <button
          type="submit"
          className={`p-2 rounded-full ${
            !text.trim() && !imagePreview
              ? "bg-gray-200 text-gray-500 dark:bg-gray-800 dark:text-gray-500 cursor-not-allowed"
              : "bg-primary text-white hover:bg-primary/90 dark:hover:bg-primary/80"
          } transition-colors`}
          disabled={(!text.trim() && !imagePreview) || disabled}
          aria-label="Send message"
        >
          <Send className="h-5 w-5" />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
