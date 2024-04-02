import App from "../components/Main";
interface HomeProps {
  params: {
    id: string;
  };
}
export default function Home({ params }: HomeProps) {
  return <App id={params.id}></App>;
}
