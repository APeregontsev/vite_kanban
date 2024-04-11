import { useState } from "react";

export function useDragNDrop(options: {
  dataToSendOnDrag?: string;
  onSendDroppedData: (data: string) => void;
}) {
  const { dataToSendOnDrag, onSendDroppedData } = options;
  const [dragOverHighlight, setDragOverHighlight] = useState<boolean>(false);
  const [dragStartHighlight, setDragStartHighlight] = useState<boolean>(false);

  function onDragStart(e: React.DragEvent<HTMLDivElement>) {
    if (!dataToSendOnDrag) {
      return;
    }

    e.dataTransfer.clearData();
    e.dataTransfer.setData("text/plain", dataToSendOnDrag);
    setDragStartHighlight(true);
  }

  function onDrop(e: React.DragEvent<HTMLElement>) {
    e.preventDefault();
    e.stopPropagation();

    const data = e.dataTransfer.getData("text");
    setDragOverHighlight(false);
    setDragStartHighlight(false);

    onSendDroppedData(data);
  }

  function onDragEnd(e: React.DragEvent<HTMLElement>) {
    e.preventDefault();
    e.stopPropagation();
    setDragStartHighlight(false);
  }

  function onDragOver(e: React.DragEvent<HTMLElement>) {
    e.preventDefault();
    e.stopPropagation();
    setDragOverHighlight(true);
  }

  function onDragLeave(e: React.DragEvent<HTMLElement>) {
    e.preventDefault();
    e.stopPropagation();
    setDragOverHighlight(false);
  }

  return {
    dragOverHighlight,
    dragStartHighlight,
    dragHandlers: {
      onDragStart,
      onDrop,
      onDragOver,
      onDragLeave,
      onDragEnd,
    },
  };
}
