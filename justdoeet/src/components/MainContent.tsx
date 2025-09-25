"use client";

import { DndContext, useDroppable, useDraggable } from "@dnd-kit/core";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Icon } from "@iconify/react";
import localforage from "localforage";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import TaskItem from "@/components/TaskItem";
import { toast } from "sonner";
import AddTodo from "@/components/modals/AddToDo";
import { useUserData } from "@/hooks/useUserData";
import Greeting from "./common/Greeting";
import ChatBot from "./common/Chatbot";
import { DraggableTodo } from "@/components/common/DragToDo";
import { DropZone } from "./common/DropZone";
import {
  getLocalTodos,
  deleteLocalTodo,
  updateLocalTodo,
} from "@/utils/localsstorage";

export interface Todo {
  id: string | number;
  todo: string;
  completed: boolean;
  [key: string]: any;
}

interface MainContentProps {
  user?: string;
  searchTerm: string;
  filter: "completed" | "incomplete" | "all";
}

export async function fetchAllTodos(): Promise<{ todos: Todo[] }> {
  const res = await fetch("https://dummyjson.com/todos?limit=100");
  if (!res.ok) throw new Error("API fetch failed.");

  const data = await res.json();
  const localTodos = await getLocalTodos();

  const deletedIds: (string | number)[] =
    (await localforage.getItem("deletedApiTodos")) || [];

  const apiTodos = data.todos.filter(
    (todo: Todo) => !deletedIds.includes(todo.id)
  );

  return { todos: [...localTodos, ...apiTodos] };
}

function MainContent({ user, searchTerm, filter }: MainContentProps) {
  const [page, setPage] = useState<number>(1);
  const [isAddOpen, setIsAddOpen] = useState<boolean>(false);
  const [selectedTodos, setSelectedTodos] = useState<(string | number)[]>([]);
  //   const { userData, hasMounted } = useUserData();

  const queryClient = useQueryClient();

  const { data, isError } = useQuery<{ todos: Todo[] }, Error>({
    queryKey: ["todos"],
    queryFn: fetchAllTodos,
  });

  const allTodos = data?.todos || [];

  allTodos.sort(
    (a, b) => (parseInt(String(a.id)) || 0) - (parseInt(String(b.id)) || 0)
  );

  const uncompleted = allTodos.filter((task) => !task.completed);

  const filtered = uncompleted
    .filter((task) =>
      task.todo.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((task) => {
      if (filter === "completed") return task.completed;
      if (filter === "incomplete") return !task.completed;
      return true;
    });

  const pageSize = 10;
  const totalPages = Math.ceil(filtered.length / pageSize);
  const startIdx = (page - 1) * pageSize;
  const paginated = filtered.slice(startIdx, startIdx + pageSize);

  const handleToggleSelect = (id: string | number) => {
    setSelectedTodos((prev) =>
      prev.includes(id) ? prev.filter((todoId) => todoId !== id) : [...prev, id]
    );
  };

  const handleDelete = async (ids: (string | number)[]) => {
    try {
      for (const id of ids) {
        if (parseInt(String(id)) <= 150) {
          // Fake delete call to dummyjson
          await fetch(`https://dummyjson.com/todos/${id}`, {
            method: "DELETE",
          });

          // Persist deleted IDs locally
          const deleted: (string | number)[] =
            (await localforage.getItem("deletedApiTodos")) || [];
          await localforage.setItem("deletedApiTodos", [
            ...new Set([...deleted, id]),
          ]);
        } else {
          await deleteLocalTodo(id);
        }
      }

      toast.success("Deleted.");
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete.");
    }
    setSelectedTodos([]);
  };

  const handleMarkAsCompleted = async () => {
    try {
      for (const id of selectedTodos) {
        if (parseInt(String(id)) <= 150) {
          await fetch(`https://dummyjson.com/todos/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ completed: true }),
          });
        } else {
          await updateLocalTodo(id, { completed: true });
        }
      }
      toast.success("Marked as completed.");
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      setSelectedTodos([]);
    } catch (err) {
      console.error(err);
      toast.error("Failed to mark.");
    }
  };

  if (isError) {
    return (
      <p aria-live="assertive" className="p-6 text-orange-800">
        Error loading todos.
      </p>
    );
  }

  if (allTodos.length === 0) {
    return (
      <p className="p-6 text-orange-800 flex items-center justify-center text-lg font-extrabold">
        No tasks available just yet!
      </p>
    );
  }

  const total = allTodos.length;
  const completedCount = allTodos.filter((task) => task.completed).length;
  const pendingCount = total - completedCount;
  const completedPercentage = total
    ? Math.round((completedCount / total) * 100)
    : 0;
  const pendingPercentage = total
    ? Math.round((pendingCount / total) * 100)
    : 0;

  return (
    <DndContext
      onDragEnd={(event) => {
        const { over, active } = event;
        if (over?.id === "delete-zone" && active.id) {
          handleDelete([active.id as string | number]);
        }
      }}
    >
      <main className="p-4 bg-white rounded-md shadow-md relative w-full">
        <Greeting />
        <section aria-label="Uncompleted To-Dos">
          <Card className="p-4 mb-6">
            <CardHeader className="flex flex-col sm:items-center sm:justify-between gap-2 mb-2">
              <h2 className="text-lg font-semibold">To-Do List</h2>
              <div className="flex gap-2 items-start">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      asChild
                      variant="ghost"
                      size="icon"
                      aria-label="Add Todo"
                    >
                      <span>
                        <Icon
                          icon="mdi:plus"
                          className="w-5 h-5 text-orange-700"
                        />
                      </span>
                    </Button>
                  </DialogTrigger>

                  <DialogContent>
                    <AddTodo closeModal={() => setIsAddOpen(false)} />
                  </DialogContent>
                </Dialog>

                <Button
                  onClick={handleMarkAsCompleted}
                  variant="ghost"
                  size="icon"
                  aria-label="Mark as Completed"
                  className="text-amber-700"
                >
                  <Icon icon="mdi:check-bold" className="w-5 h-5" />
                </Button>

                <DropZone onDrop={(id) => handleDelete([id])}>
                  <Button
                    onClick={() =>
                      selectedTodos.length && handleDelete(selectedTodos)
                    }
                    variant="ghost"
                    size="icon"
                    aria-label="Delete Selected"
                    className="text-orange-700"
                  >
                    <Icon icon="mdi:delete" className="w-5 h-5 -mt-3" />
                  </Button>
                </DropZone>
              </div>
            </CardHeader>

            <CardContent>
              {paginated.length > 0 ? (
                <>
                  {paginated.map((task, i) => (
                    <DraggableTodo key={task.id} id={task.id}>
                      <div className="flex items-center gap-2 mb-2 hover:bg-gray-100 p-2 rounded-md">
                        <input
                          type="checkbox"
                          checked={selectedTodos.includes(task.id)}
                          onChange={() => handleToggleSelect(task.id)}
                          className="accent-orange-700"
                        />
                        <Link
                          href={`/todo/${task.id}`}
                          className="flex-1 block hover:underline"
                        >
                          <TaskItem
                            task={task}
                            index={(page - 1) * pageSize + i}
                            isLocal={parseInt(String(task.id)) > 150}
                          />
                        </Link>
                      </div>
                    </DraggableTodo>
                  ))}

                  <div className="flex flex-wrap justify-center items-center gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="default"
                      disabled={page <= 1}
                      onClick={() => setPage((p) => p - 1)}
                      className="text-orange-800"
                    >
                      Prev
                    </Button>
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <Button
                        key={i + 1}
                        variant={page === i + 1 ? "default" : "outline"}
                        size="default"
                        onClick={() => setPage(i + 1)}
                        className="text-orange-800"
                        disabled={page === i + 1}
                      >
                        {i + 1}
                      </Button>
                    ))}

                    <Button
                      variant="outline"
                      size="default"
                      disabled={page >= totalPages}
                      onClick={() => setPage((p) => p + 1)}
                      className="text-orange-800"
                    >
                      Next
                    </Button>
                  </div>
                </>
              ) : (
                <p className="text-gray-500">
                  Great Job! You've completed all tasks.
                </p>
              )}
            </CardContent>
          </Card>
        </section>

        <section aria-label="Progress Summary">
          <Card className="p-4 sm:p-6">
            <CardHeader>
              <h2 className="text-lg font-semibold mb-4 text-orange-800">
                Task Progress
              </h2>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="flex justify-between mb-1 text-orange-800">
                  <span>Completed</span>
                  <span>{completedPercentage}%</span>
                </div>
                <Progress value={completedPercentage} />
              </div>

              <div>
                <div className="flex justify-between mb-2 text-orange-800">
                  <span>Pending</span>
                  <span>{pendingPercentage}%</span>
                </div>
                <div className="[&>div]:bg-orange-900">
                  <Progress value={pendingPercentage} />
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
        <ChatBot />
      </main>
    </DndContext>
  );
}

export default MainContent;
