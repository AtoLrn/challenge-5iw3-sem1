import { useRevalidator } from "@remix-run/react";

export default function Test() {  
    const revalidator = useRevalidator(); 

    return (
      <button onClick={() => { revalidator.revalidate() }}> { revalidator.state === 'loading' ? 'Reloading Data' : 'Data'}</button>
    );
  }