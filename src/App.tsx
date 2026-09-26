import "./App.css";
import Channel from "./components/Channel";
import Footer from "./components/Footer";
import Playlist from "./components/Playlist";
import Sidebar from "./components/Sidebar";
import Video from "./components/Video";
import { useAppContext } from "./context/AppContext";

const App = () => {
  const { selected } = useAppContext();

  return (
    <main className="h-screen bg-[#101014] text-white flex overflow-hidden">
      <div className="bg-[#13111A] w-52 border-r-2 border-[#29272B] py-5 px-4 h-full overflow-y-auto hidden md:block">
        <Sidebar />
      </div>
      <div className="bg-[#13111A] w-full border-t-2 border-[#29272B] py-5 px-4 h-16 overflow-y-auto md:hidden fixed left-0 right-0 bottom-0">
        <Footer />
      </div>
      <section className="bg-[#101014] py-6 px-2 md:px-3 lg:px-8 flex-1 h-full overflow-y-auto">
        {selected === "video" && <Video />}
        {selected === "channel" && <Channel />}
        {selected === "playlist" && <Playlist />}
      </section>
    </main>
  );
};

export default App;
