import { getServerSession } from "next-auth";
import Eventswrapper from "@/components/Eventswrapper";

const EventsPage = async () => {
 const session = await getServerSession();
 const user = session?.user;
 return <Eventswrapper user={user as { role: string; id: string }} />;
};

export default EventsPage;
