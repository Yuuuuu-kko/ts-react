import "./App.css";
import { useEffect, useState } from "react";
import { getTodos, type Todo } from "./test";

// Omit 계속 쓰기 귀찮을것 같아서 custom type만들어주기
type ToggleTodo = Omit<Todo, "title">;

function App() {
  const [todoList, setTodoList] = useState<Todo[]>([]); // todolist 받아오기
  useEffect(() => {
    getTodos().then((data) => setTodoList(data.data));
  }, []);

  const [title, setTitle] = useState("");

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  // Create //
  const handleAddTodo = () => {
    if (title === "") {
      return;
    }

    const newTodo: Todo = {
      id: crypto.randomUUID(),
      title,
      completed: false,
    };

    fetch("http://localhost:3000/todos", {
      method: "POST",
      body: JSON.stringify(newTodo),
    });

    setTodoList((prev) => [...prev, newTodo]);
    setTitle("");
  };

  // Delete // 반환값 없는거 유의 깊게 볼것(Promise)
  const handleDeleteTodo = async (id: Todo["id"]) => {
    await fetch(`http://localhost:3000/todos/${id}`, {
      method: "DELETE",
    });

    setTodoList((prev) => prev.filter((todo) => todo.id !== id)); // setTodos에 이전값에서 우리가 넣어준 아이디와 다른 친구들만 지우는걸로 업데이트
  };

  // Update(complete값을 true로 만들고자한다) //
  const handleToggleTodo = async ({ id, completed }: ToggleTodo) => {
    await fetch(`http://localhost:3000/todos/${id}`, {
      method: "PATCH",
      body: JSON.stringify({
        completed: !completed,
      }),
    });

    setTodoList((prev) =>
      prev.map((todo) => {
        if (todo.id === id) {
          return {
            ...todo,
            completed: !completed,
          };
        }
        return todo;
      })
    );
  };

  return (
    <>
      <TodoList
        todoList={todoList}
        onDeleteClick={handleDeleteTodo}
        onToggleClick={handleToggleTodo}
      />
      <input type="text" value={title} onChange={handleTitleChange} />
      <button onClick={handleAddTodo}>등록</button>
    </>
  );

  type TodoListProps = {
    todoList: Todo[];
    onDeleteClick: (id: Todo["id"]) => void;
    onToggleClick: (toggleTodo: ToggleTodo) => void;
  };
  function TodoList({ todoList, onDeleteClick, onToggleClick }: TodoListProps) {
    return (
      <>
        <div>
          {todoList.map((todo) => (
            <TodoItem
              key={todo.id}
              {...todo}
              onDeleteClick={onDeleteClick}
              onToggleClick={onToggleClick}
            />
          ))}
        </div>
      </>
    );
  }

  // 여기 type TodoItemProps = Todo; 까지 delete핸들러가 넘어와야한다 기존식을 바꾸어보자
  type TodoItemProps = Todo & {
    onDeleteClick: (id: Todo["id"]) => void;
    onToggleClick: (toggleTodo: ToggleTodo) => void;
  };
  function TodoItem({
    id,
    title,
    completed,
    onDeleteClick,
    onToggleClick,
  }: TodoItemProps) {
    return (
      <>
        <div>
          <div>id: {id}</div>
          <div
            onClick={() =>
              onToggleClick({
                id,
                completed,
              })
            }
          >
            title: {title}
          </div>
          <div>completed: {`${completed}`}</div>
          <button onClick={() => onDeleteClick(id)}>삭제</button>
        </div>
        *******
      </>
    );
  }
}
export default App;
