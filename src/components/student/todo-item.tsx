"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { TodoItem as TodoItemType } from "@/lib/student-types";
import { Pencil, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

interface TodoItemProps {
  todo: TodoItemType;
  onToggleComplete: (id: string, completed: boolean) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TodoItem({
  todo,
  onToggleComplete,
  onEdit,
  onDelete,
}: TodoItemProps) {
  const priorityColors = {
    low: "bg-slate-100 text-slate-700",
    medium: "bg-blue-100 text-blue-700",
    high: "bg-red-100 text-red-700",
  };

  return (
    <div
      className={`flex items-start gap-2 p-3 rounded-md border ${
        todo.completed ? "bg-muted/50" : "bg-background"
      }`}
    >
      <Checkbox
        className="mt-1"
        checked={todo.completed}
        onCheckedChange={(checked) =>
          onToggleComplete(todo.id, checked as boolean)
        }
        aria-label={`${todo.title} 완료 여부`}
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3
            className={`font-medium text-sm ${
              todo.completed ? "line-through text-muted-foreground" : ""
            }`}
          >
            {todo.title}
          </h3>
          <Badge variant="outline" className={priorityColors[todo.priority]}>
            {todo.priority === "low"
              ? "낮음"
              : todo.priority === "medium"
              ? "중간"
              : "높음"}
          </Badge>
          {todo.subject && (
            <Badge variant="secondary" className="text-xs">
              {todo.subject}
            </Badge>
          )}
        </div>

        {todo.description && (
          <p
            className={`text-xs mt-1 ${
              todo.completed ? "text-muted-foreground" : "text-foreground/80"
            }`}
          >
            {todo.description}
          </p>
        )}

        {todo.dueDate && (
          <p
            className={`text-xs mt-1 ${
              !todo.completed && new Date() > todo.dueDate
                ? "text-red-500"
                : "text-muted-foreground"
            }`}
          >
            마감: {format(todo.dueDate, "yyyy-MM-dd")}
          </p>
        )}
      </div>

      <div className="flex shrink-0 gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => onEdit(todo.id)}
          aria-label={`${todo.title} 편집하기`}
        >
          <Pencil className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-destructive"
          onClick={() => onDelete(todo.id)}
          aria-label={`${todo.title} 삭제하기`}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
