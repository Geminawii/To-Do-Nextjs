
import { useDroppable } from "@dnd-kit/core";
import React from "react";

type DropZoneProps = {
  onDrop: (id: string | number) => void;
  children?: React.ReactNode; 
};

export function DropZone({ children }: DropZoneProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: "delete-zone",
  });

  return (
    <div
      ref={setNodeRef}
      className={`p-2 rounded ${
        isOver ? "bg-red-200" : "bg-transparent"
      }`}
    >
      {children}
    </div>
  );
}
