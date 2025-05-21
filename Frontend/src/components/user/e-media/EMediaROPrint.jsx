import React from "react";
import { Link } from "react-router-dom";

function EMediaROPrint() {
    return (
        <main id="main" className="main">
            <div className="pagetitle">
                <h1>E-Media RO List</h1>
                <nav>
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                            <Link to={"/"}>E-Media</Link>
                        </li>
                        <li className="breadcrumb-item active">RO List</li>
                    </ol>
                </nav>
            </div>
        </main>
    )
};

export default EMediaROPrint;