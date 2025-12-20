type NotificationProps = {
  message: string;
};

export default function Notification({ message }: NotificationProps) {
  return (
    <div className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded shadow">
      {message}
    </div>
  );
}