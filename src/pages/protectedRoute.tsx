import { AppContext } from "@/context/AppContext";
import { useContext} from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {

    const {isLoggedIn, checkAuth, authLoading} = useContext(AppContext);

    if (authLoading) {
        return <p>Checking authentication...</p>;
    }

    if (!isLoggedIn) {
        return <Navigate to="/sign-in" replace />;
    }

    return children;
};

export default ProtectedRoute;