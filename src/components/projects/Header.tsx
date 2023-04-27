import CreateProject from "./CreateProject";

export default function Header() {
  return (
    <div className="flex flex-row items-center justify-between">
      <h4 className="select-none text-sm font-medium leading-none">Projekty</h4>
      <div className="flex flex-row items-center justify-between gap-2">
        <CreateProject />
      </div>
    </div>
  );
}
