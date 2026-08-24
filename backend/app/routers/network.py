from typing import Dict, Any
from fastapi import APIRouter, HTTPException, status
from ..models.schemas import NetworkCluster, NetworkNode, NetworkEdge
from ..services.graph_engine import graph_engine

router = APIRouter(prefix="/network", tags=["Network Topology"])

NETWORK_CLUSTERS: Dict[str, NetworkCluster] = {
    "CLUSTER_ALPHA_9": NetworkCluster(
        id="CLUSTER_ALPHA_9",
        name="Syndicate Command Core (Alpha 9)",
        description="Central command nexus coordinating multi-state hawala and encrypted communications.",
        nodes=[
            NetworkNode(id="N1", label="Rahul Sharma", category="SUSPECT", risk=95, degree=14, group="CORE"),
            NetworkNode(id="N2", label="Shell Corp B (HK)", category="FINANCIAL", risk=89, degree=8, group="FINANCE"),
            NetworkNode(id="N3", label="Vikram Mehta", category="SUSPECT", risk=88, degree=9, group="CORE"),
            NetworkNode(id="N4", label="Burner +91-98765...", category="COMMUNICATION", risk=78, degree=6, group="SIGINT"),
            NetworkNode(id="N5", label="Dubai Bullion Vault", category="FINANCIAL", risk=92, degree=5, group="FINANCE"),
            NetworkNode(id="N6", label="IP 77.9.142.88 (C2)", category="INFRASTRUCTURE", risk=99, degree=12, group="CYBER"),
        ],
        edges=[
            NetworkEdge(source="N1", target="N2", label="$450K Wire", weight=4.5, type="TRANSACTION"),
            NetworkEdge(source="N1", target="N3", label="Encrypted Calls (42)", weight=3.8, type="CALL"),
            NetworkEdge(source="N1", target="N4", label="SIM Insertion", weight=2.0, type="DEVICE"),
            NetworkEdge(source="N2", target="N5", label="Hawala Gold Purchase", weight=5.0, type="TRANSACTION"),
            NetworkEdge(source="N1", target="N6", label="C2 Keep-Alive Ping", weight=4.0, type="NETWORK"),
            NetworkEdge(source="N3", target="N5", label="Escrow Release", weight=3.2, type="TRANSACTION"),
        ]
    ),
    "CLUSTER_FINANCIAL_NEXUS": NetworkCluster(
        id="CLUSTER_FINANCIAL_NEXUS",
        name="Cross-Border Financial Trail",
        description="Offshore shell companies, multi-layered wire transfers, and crypto escrow pools.",
        nodes=[
            NetworkNode(id="FN1", label="Apex Logistics Holdings", category="FINANCIAL", risk=91, degree=7, group="FINANCE"),
            NetworkNode(id="FN2", label="Dubai Bullion Exchange", category="FINANCIAL", risk=97, degree=11, group="FINANCE"),
            NetworkNode(id="FN3", label="Swiss Escrow #88", category="FINANCIAL", risk=78, degree=4, group="FINANCE"),
            NetworkNode(id="FN4", label="Tether USDT Mixer", category="CRYPTO", risk=99, degree=15, group="CYBER"),
        ],
        edges=[
            NetworkEdge(source="FN1", target="FN2", label="$1.2M Bullion Route", weight=5.0, type="TRANSACTION"),
            NetworkEdge(source="FN2", target="FN3", label="Tier 1 Private Transfer", weight=4.2, type="TRANSACTION"),
            NetworkEdge(source="FN1", target="FN4", label="DeFi Mixer Swap", weight=4.8, type="CRYPTO"),
        ]
    )
}

@router.get("/clusters")
def get_all_clusters():
    return {
        "success": True,
        "clusters": list(NETWORK_CLUSTERS.values())
    }

@router.get("/{cluster_id}")
def get_cluster_by_id(cluster_id: str):
    cluster_key = cluster_id.upper()
    cluster = NETWORK_CLUSTERS.get(cluster_key, NETWORK_CLUSTERS["CLUSTER_ALPHA_9"])

    return {
        "success": True,
        "cluster": cluster
    }

@router.post("/path")
def compute_shortest_path(payload: Dict[str, Any]):
    start = payload.get("startNode")
    end = payload.get("endNode")
    cluster_id = payload.get("clusterId", "CLUSTER_ALPHA_9").upper()

    cluster = NETWORK_CLUSTERS.get(cluster_id, NETWORK_CLUSTERS["CLUSTER_ALPHA_9"])
    node_ids = [n.id for n in cluster.nodes]
    edge_dicts = [{"source": e.source, "target": e.target} for e in cluster.edges]

    path = graph_engine.find_shortest_path(node_ids, edge_dicts, start, end)

    return {
        "success": True,
        "path": path
    }
