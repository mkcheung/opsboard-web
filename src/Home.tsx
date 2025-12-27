import {
    getActiveBackend,
} from "./config/backend";
const Home = () => {
    return <div>
        <div>Opsboard</div>
        <div>Current Plaform: {getActiveBackend()}</div>
    </div>
}

export default Home;