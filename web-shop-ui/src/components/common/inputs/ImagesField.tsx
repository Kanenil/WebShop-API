import { useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { DropZone } from "../other/DropZone";
import { Photo } from "../other/Photo";

interface Props {
  label?: string;
  value: File[] | string[] | null;
  field: string;
  defaultImage: string;
  touched?: boolean | null;
  error?: string | null;
  accept?: string;
  onChange: (value: (File | string)[]) => void;
}

export const ImagesField: React.FC<Props> = ({
  label,
  field,
  touched = null,
  error = null,
  accept = "image/jpg, image/jpeg, image/png",
  value,
  onChange,
  defaultImage,
  ...props
}) => {
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    const items = [...(value || [])];
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    onChange(items);
  };

  const handleDelete = (id: string | File) => {
    const items = [...(value || [])];
    onChange(items.filter((photo) => photo !== id));
  };

  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="photos">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            >
              <DropZone
                onDrop={(files) => {
                  onChange([...(value || []), ...files]);
                }}
              />
              {value?.map((photo, index) => (
                <Draggable
                  key={`image-${index}`}
                  draggableId={`image-${index}`}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <Photo photo={photo} onDelete={handleDelete} />
                    </div>
                  )}
                </Draggable>
              ))}

              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      {touched && error && <p className="mt-3 text-xs text-red-400">{error}</p>}
    </>
  );
};
