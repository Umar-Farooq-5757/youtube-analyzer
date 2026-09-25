import "./App.css";
import Channel from "./components/Channel";
import Sidebar from "./components/Sidebar";
import Video from "./components/Video";
import { useAppContext } from "./context/AppContext";

const App = () => {
  const { selected } = useAppContext();

  return (
    <main className="h-screen bg-[#101014] text-white flex overflow-hidden">
      <div className="bg-[#13111A] w-[18%] border-r-2 border-[#29272B] py-5 px-6 h-full overflow-y-auto">
        <Sidebar />
      </div>
      <section className="bg-[#101014] py-6 px-8 flex-1 h-full overflow-y-auto">
        {selected === "video" && <Video />}
        {selected === "channel" && <Channel />}
        {selected === "playlist" && <div>playlist</div>}
      </section>
    </main>
  );
};

export default App;
