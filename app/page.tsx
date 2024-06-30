import { cookies } from 'next/headers';
import DiagramList from './components/diagramList/diagramList';

export default function Home() {
  const cookieStore = cookies()

  return <DiagramList token={cookieStore.get('appSession')?.value}></DiagramList>;
}
