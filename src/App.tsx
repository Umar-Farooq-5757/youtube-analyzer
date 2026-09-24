import "./App.css";
import Sidebar from "./components/Sidebar";
import Video from "./components/Video";
import { useAppContext } from "./context/AppContext";

const App = () => {
  const { selected } = useAppContext();

  return (
    <main className="min-h-screen bg-[#101014] text-white flex">
      <div className="bg-[#13111A] w-[17%] border-r-2 border-[#29272B] py-5 px-6">
        <Sidebar />
      </div>
      <section className="bg-[#101014] py-6 px-8 flex flex-1">
        {selected === "video" && <Video />}
        {selected === "channel" && <div>channel</div>}
        {selected === "playlist" && <div>playlist</div>}
      </section>
    </main>
  );
};

export default App;