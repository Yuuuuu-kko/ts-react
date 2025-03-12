// type CustomType = {
//   name: string;
//   age: number;
// };

// interface CustomType2 {
//   name: string;
//   age: number;
// }

// let variable: number = 1;

// // 함수 인자 넣어주고싶으면 뒤에 명시해주는 방법
// function add(a: number, b: number): number {
//   return a + b;
// }

// // 객체를 넣고싶다하면 객체 뒤에 구조적인것만 맞춰주는 방법
// function add2({ a, b }: { a: number; b: number }): number {
//   return a + b;
// }

// add2({ a: 1, b: 2 });

export type Todo = {
  id: string;
  title: string;
  completed: boolean;
};

// 비동기 api 콜이 언제 어디서 올지모르니까 명시적으로 타입을 지정
export async function getTodos(): Promise<Todo[]> {
  const res = await fetch("http://localhost:3000/todos");
  const data: Todo[] = await res.json(); //  Todo[] 명시적으로 지정

  return data;
}

getTodos().then(console.log);
