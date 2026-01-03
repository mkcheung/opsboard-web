import {
    useNavigate
} from "react-router-dom";
import {
    useAppDispatch,
} from "../../store/hooks/hooks";
import {
    useEffect,
    useState
} from "react";
import {
    authActions
} from "../../store/auth/authSlice";

interface ProjectType {
    id: string
    name: string
    description: string
}

const Dashboard = () => {
    return (
        <div>
            <div className="pageHeader">
                <h1 className="h1">Dashboard</h1>
            </div>

            <div className="card">
                <div className="cardBody">
                    <div className="mutedText">
                        Overview goes here (recent projects, activity, etc.)
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;