import { useState } from "react";

export function useDragNDrop(options: {
  dataToSendOnDrag?: string;
  onSendDroppedData: (data: string) => void;
}) {
  const { dataToSendOnDrag, onSendDroppedData } = options;
  const [dragOverHighlight, setDragOverHighlight] = useState<boolean>(false);

  function onDragStart(e: React.DragEvent<HTMLDivElement>) {
    if (!dataToSendOnDrag) {
      return;
    }

    e.dataTransfer.clearData();
    e.dataTransfer.setData("text/plain", dataToSendOnDrag);
  }

  function onDrop(e: React.DragEvent<HTMLElement>) {
    e.preventDefault();
    e.stopPropagation();

    const data = e.dataTransfer.getData("text");
    setDragOverHighlight(false);

    onSendDroppedData(data);
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
    dragHandlers: {
      onDragStart,
      onDrop,
      onDragOver,
      onDragLeave,
    },
  };
}
