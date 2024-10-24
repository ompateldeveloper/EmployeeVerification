export default function Home() {
    console.log(import.meta.env.BASE_URL);
    
    return <div className="p-4">{import.meta.env.VITE_BASE_URL}</div>;
}
