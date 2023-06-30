import { useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import ReactFlow, {
  addEdge,
  updateEdge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Position,
  type OnConnect,
  type OnEdgeUpdateFunc,
  type Edge,
  type EdgeTypes,
} from "reactflow";
import { useRouter } from "next/router";
import { Separator } from "~/components/ui/separator";
import ErrorMessage from "~/components/ui/error-message";
import ProjectTitle from "~/components/projects/ProjectTitle";
import ProjectOptions from "~/components/projects/ProjectOptions";
import ParticipantsList from "~/components/projects/participants/ParticipantsList";
import InviteUser from "~/components/invites/InviteUser";
import { Button } from "~/components/ui/button";
import { LayoutTemplate, Home } from "lucide-react";
import { api } from "../../../utils/api";
import PlanNode from "~/components/projects/plan/PlanNode";
import ResizableGroup from "~/components/projects/plan/ResizableGroup";
import CustomEdge from "~/components/projects/plan/CustomEdge";

import "reactflow/dist/style.css";

const nodeTypes = {
  planNode: PlanNode,
  resizableGroup: ResizableGroup,
};

const edgeTypes: EdgeTypes = {
  default: CustomEdge,
};

export default function ProjectPlanPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const query = api.projects.getById.useQuery(id, {
    retry: false,
    enabled: typeof id === "string",
  });
  const edgeUpdateSuccessful = useRef(true);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  const onEdgeUpdateStart = useCallback(() => {
    edgeUpdateSuccessful.current = false;
  }, []);

  const onEdgeUpdate: OnEdgeUpdateFunc = useCallback(
    (oldEdge, newConnection) => {
      edgeUpdateSuccessful.current = true;
      setEdges((els) => updateEdge(oldEdge, newConnection, els));
    },
    [setEdges]
  );

  const onEdgeUpdateEnd = useCallback(
    (_: any, edge: Edge) => {
      if (!edgeUpdateSuccessful.current) {
        setEdges((eds) => eds.filter((e) => e.id !== edge.id));
      }

      edgeUpdateSuccessful.current = true;
    },
    [setEdges]
  );

  useEffect(() => {
    setNodes([]);
  }, [setNodes]);

  const addNode = () =>
    setNodes([
      ...nodes,
      {
        id: new Date().getTime().toString(),
        type: "planNode",
        data: {},
        style: {
          background: "white",
          borderRadius: "4px",
          paddingBottom: "8px",
        },
        position: { x: 0, y: 0 },
      },
    ]);

  const addGroup = () =>
    setNodes([
      ...nodes,
      {
        id: new Date().getTime().toString(),
        type: "resizableGroup",
        data: {},
        style: {
          padding: 10,
          background: "rgb(59 130 246 / 0.3)",
          border: "1px solid black",
          borderRadius: "4px",
          zIndex: "-1",
        },
        position: { x: 0, y: 0 },
      },
    ]);

  if (query.isLoading) {
    return "Ładowanie";
  }

  if (query.error) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <ErrorMessage message="Nie znaleziono projektu" />
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col">
      <header className="flex h-10 flex-shrink-0 flex-row items-center justify-between">
        <div className="flex flex-row gap-2">
          <ProjectTitle project={query.data} />
          <ProjectOptions
            id={id}
            ownerId={query.data.ownerId}
            status={query.data.status}
          />
        </div>
        <div className="flex flex-row items-center gap-4">
          <ParticipantsList id={id} />
          <InviteUser id={id} ownerId={query.data.ownerId} />
        </div>
      </header>
      <nav className="flex flex-row gap-4">
        <Link href={`/projects/${id}`} legacyBehavior>
          <a className="inline-flex flex-col items-center">
            <div className="inline-flex items-center">
              <Home className="mr-2 h-4 w-4" />
              <span className="truncate">Projekt</span>
            </div>
            {router.asPath === `/projects/${id}` ? (
              <div className="w-full translate-y-[9px] border-b border-primary"></div>
            ) : null}
          </a>
        </Link>
        <Link href={`/projects/${id}/plan`} legacyBehavior>
          <a className="inline-flex flex-col items-center">
            <div className="inline-flex items-center">
              <LayoutTemplate className="mr-2 h-4 w-4" />
              <span className="truncate">Plan projektu</span>
            </div>
            {router.asPath === `/projects/${id}/plan` ? (
              <div className="w-full translate-y-[9px] border-b border-primary"></div>
            ) : null}
          </a>
        </Link>
      </nav>
      <Separator className="mb-2 mt-2" />
      <section className="flex-1">
        <ReactFlow
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          snapToGrid
          fitView
          onEdgeUpdate={onEdgeUpdate}
          onEdgeUpdateStart={onEdgeUpdateStart}
          onEdgeUpdateEnd={onEdgeUpdateEnd}
          onConnect={onConnect}
          attributionPosition="top-right"
          proOptions={{ hideAttribution: true }}
        >
          <Background />
          <Controls />
          <Button
            className="absolute left-2 top-2 z-10"
            size="sm"
            onClick={addNode}
          >
            Dodaj blok
          </Button>
          <Button
            className="absolute left-32 top-2 z-10"
            size="sm"
            onClick={addGroup}
          >
            Dodaj grupe
          </Button>
        </ReactFlow>
      </section>
    </div>
  );
}
