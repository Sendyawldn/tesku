import { redirect } from 'next/navigation';

export default function Home() {
  // Sementara ini kita alihkan root langsung ke dashboard
  redirect('/login');
}
