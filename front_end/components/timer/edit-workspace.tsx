"use client";

import type React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import toast from "react-hot-toast";

interface CreateWorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEditWorkspace: (name: string, description: string) => void;
  updating_workspace: boolean;
  workspaceName: string;
  workspaceDescription: string;
}

export function EditWorkspaceModal({
  isOpen,
  onClose,
  onEditWorkspace,
  updating_workspace,
  workspaceDescription,
  workspaceName,
}: CreateWorkspaceModalProps) {
  const [name, setName] = useState(workspaceDescription);
  const [description, setDescription] = useState(workspaceName);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (name == workspaceName && description == workspaceName) {
      toast.error("Nothing changed");
      return;
    }
    onEditWorkspace(name, description);
    setName("");
    setDescription("");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-gray-800 rounded-lg p-6 w-full max-w-md"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-white">
                Edit Timer Workspace
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-gray-400 bg-red-600 hover:text-white hover:bg-red-600"
              >
                <X className="h-6 w-6" />
              </Button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Workspace Name
                </label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter workspace name"
                  className="w-full bg-gray-700 text-white border-gray-600 focus:border-rose-500"
                  required
                  minLength={2}
                  maxLength={30}
                />
              </div>
              <div className="mb-6">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Description
                </label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter workspace description"
                  className="w-full bg-gray-700 text-white border-gray-600 focus:border-rose-500"
                  rows={3}
                  minLength={4}
                  maxLength={50}
                  required
                />
              </div>
              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="mr-2 bg-gray-700 text-white border-gray-600 hover:bg-gray-600 hover:text-white"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-rose-500 text-white hover:bg-rose-600 transform transition-transform duration-200 hover:scale-105"
                >
                  {updating_workspace ? "Updating..." : "Edit"}
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
