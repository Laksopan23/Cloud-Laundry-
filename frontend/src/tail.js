import { Button } from 'antd';

export default function App() {
  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-semibold mb-6">Welcome to React + Tailwind + Ant Design!</h1>
      <Button type="primary" className="rounded-lg">
        Ant Design Button with Tailwind Rounded Corners
      </Button>
    </div>
  );
}
