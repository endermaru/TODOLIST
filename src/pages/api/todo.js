let todoList = [];
let lastUpdated = Date.now(); // 변화를 감지할 변수

export default function handler(req, res) {
  if (req.method === 'GET') {
    res.status(200).json(todoList);
  } else if (req.method === 'POST') {
    todoList = req.body.todo;
    lastUpdated = Date.now(); // 변수 갱신
    res.status(200).json({ message: 'Todo added successfully' });
  }
}

export function getLastUpdated() {
  return lastUpdated; // 변화를 감지할 변수 반환
}