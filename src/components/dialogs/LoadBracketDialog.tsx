"use client";

import { Calendar, FolderOpen, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useBracket } from "@/contexts/BracketContext";
import { deleteBracket, getSavedBrackets } from "@/lib/storage";
import type { SavedBracket } from "@/types";

interface LoadBracketDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LoadBracketDialog({
  open,
  onOpenChange,
}: LoadBracketDialogProps) {
  const { loadBracket } = useBracket();
  const [brackets, setBrackets] = useState<SavedBracket[]>([]);

  useEffect(() => {
    if (open) {
      setBrackets(getSavedBrackets());
    }
  }, [open]);

  const handleLoad = (saved: SavedBracket) => {
    loadBracket(saved.state);
    toast.success("Bracket loaded!", {
      description: `"${saved.name}" has been loaded.`,
    });
    onOpenChange(false);
  };

  const handleDelete = (id: string, name: string) => {
    deleteBracket(id);
    setBrackets(brackets.filter((b) => b.id !== id));
    toast.success("Bracket deleted", {
      description: `"${name}" has been deleted.`,
    });
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-gray-700 bg-gray-900 text-white sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">
            <FolderOpen className="h-5 w-5" />
            Load Bracket
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Load a previously saved bracket.
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-80 space-y-2 overflow-y-auto">
          {brackets.length === 0 ? (
            <div className="py-8 text-center text-gray-500">
              <FolderOpen className="mx-auto mb-2 h-12 w-12 opacity-50" />
              <p>No saved brackets yet.</p>
              <p className="text-sm">Save your first bracket to see it here.</p>
            </div>
          ) : (
            brackets.map((saved) => (
              <div
                key={saved.id}
                className="flex items-center justify-between rounded-lg border border-gray-700 bg-gray-800/50 p-3"
              >
                <div className="flex-1">
                  <h4 className="font-medium text-white">{saved.name}</h4>
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Calendar className="h-3 w-3" />
                    {formatDate(saved.updatedAt)}
                  </div>
                  <div className="mt-1 text-xs">
                    {saved.state.isComplete ? (
                      <span className="text-green-400">Complete</span>
                    ) : (
                      <span className="text-yellow-400">In Progress</span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(saved.id, saved.name)}
                    className="border-red-600/50 bg-transparent text-red-400 hover:bg-red-600/20 hover:text-red-300"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleLoad(saved)}
                    className="bg-gradient-to-r from-red-600 to-blue-600 hover:from-red-700 hover:to-blue-700"
                  >
                    Load
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="flex justify-end">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-gray-600 bg-transparent text-gray-300 hover:bg-gray-800"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
