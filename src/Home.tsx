import {
    getActiveBackend,
    setActiveBackend,
    getApiBaseUrl,
} from "./config/backend";
import { useActiveBackend } from "./config/useActiveBackend";

const Home = () => {
    const backend = useActiveBackend();
    return <div>
        <div>Opsboard</div>
        <div>Current Plaform: {getActiveBackend()}</div>

        <div>Backend: {backend}</div>
        <div>Base: {getApiBaseUrl()}</div>

        <button onClick={() => setActiveBackend("laravel")}>Laravel</button>
        <button onClick={() => setActiveBackend("django")}>Django</button>
    </div>
}

export default Home;