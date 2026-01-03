import {
    getActiveBackend,
    setActiveBackend,
    getApiBaseUrl,
} from "../../shared/config/backend";
import { useActiveBackend } from "../../shared/config/useActiveBackend";

const Home = () => {
    const backend = useActiveBackend();
    return (
        <div>
            <div className="pageHeader">
                <h1 className="h1">OpsBoard</h1>

                <div className="pageHeaderRight">
                    <button onClick={() => setActiveBackend("laravel")} className="btn btnGhost">Laravel</button>
                    <button onClick={() => setActiveBackend("django")} className="btn btnGhost">Django</button>
                </div>
            </div>

            <div className="card">
                <div className="cardBody">
                    <div style={{ display: "grid", gap: 6 }}>
                        <div><strong>Current Platform:</strong> <span className="mutedText">{getActiveBackend()}</span></div>
                        <div><strong>Backend:</strong> <span className="mutedText">{backend}</span></div>
                        <div><strong>Base:</strong> <span className="mutedText">{getApiBaseUrl()}</span></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Home;