import api from "../axios/api";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Tab } from "@headlessui/react";
import dateFormatter from "../utils/dateFormatter";

function ProfilePage() {
  const [user, setUser] = useState({});
  const [formProfile, setFormProfile] = useState({
    name: "",
    telefone: "",
    curriculo: "",
  });
  const [reload, setReload] = useState(false);

  const navigate = useNavigate();

  const id_user = localStorage.getItem("userId");

  useEffect(() => {
    async function getProfile() {
      try {
        const response = await api.get("/user/profile");
        setUser(response.data);
        //TRAZ MINHAS INFOS NO INPUT
        setFormProfile(response.data);
      } catch (error) {
        console.log(error);
      }
    }

    getProfile();
  }, [reload]);

  function handleLogout(e) {
    e.preventDefault();
    localStorage.removeItem("userToken");
    navigate("/login");
  }

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  function handleChangeProfile(e) {
    setFormProfile({ ...formProfile, [e.target.name]: e.target.value });
  }

  async function handleSubmitProfile(e) {
    e.preventDefault();

    try {
      const response = await api.put("/user/edit", formProfile);

      setReload(!reload);
    } catch (error) {
      console.log(error);
    }
  }

  async function handleUnapply(id_job) {
    try {
      await api.post(`/job/unapply/${id_job}`);

      setReload(!reload);
    } catch (error) {
      console.log(error);
    }
  }

  console.log(user);
  return (
    <div>
      <Tab.Group>
        <Tab.List className=" flex space-x-1 rounded-xl bg-blue-900/20 p-1">
          <Tab className="w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700 ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2">
            Profile
          </Tab>
          <Tab className="w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700 ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2">
            Currículo
          </Tab>
          <Tab className="w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700 ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2">
            Candidaturas
          </Tab>
        </Tab.List>

        <Tab.Panels className="mt-2">
          <Tab.Panel className="flex gap-4 rounded-xl bg-white p-3 ring-white ring-opacity-60 ring-offset-2  focus:outline-none focus:ring-2">
            <form onSubmit={handleSubmitProfile} className="w-2/3">
              <div className="flex flex-col space-y-2 mb-2">
                <label className="text-gray-600 font-semibold">Email</label>
                <input
                  disabled
                  name="email"
                  value={formProfile.email}
                  onChange={handleChangeProfile}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-500 focus:border-blue-500 bg-gray-200"
                />
              </div>

              <div className="flex flex-col space-y-2  mb-2">
                <label className="text-gray-600 font-semibold">Nome</label>
                <input
                  name="name"
                  value={formProfile.name}
                  onChange={handleChangeProfile}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="flex flex-col space-y-2  mb-2">
                <label className="text-gray-600 font-semibold">Telefone</label>
                <input
                  name="telefone"
                  value={formProfile.telefone}
                  onChange={handleChangeProfile}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <button className="mt-4 bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 px-4 rounded-lg transition duration-300">
                Salvar alterações
              </button>
            </form>

            <div className="flex justify-center items-center">
              <img src={user.profilePicture} className="rounded-full h-[150px] w-[150px]"/>
            </div>
          </Tab.Panel>

          <Tab.Panel className="rounded-xl bg-white p-3 ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2">
            <form onSubmit={handleSubmitProfile}>
              <div className="flex flex-col space-y-2">
                <label className="text-gray-600 font-semibold">Currículo</label>
                <textarea
                  rows={10}
                  name="curriculo"
                  value={formProfile.curriculo}
                  onChange={handleChangeProfile}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <button className="mt-4 bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 px-4 rounded-lg transition duration-300">
                Salvar alterações
              </button>
            </form>
          </Tab.Panel>
          <Tab.Panel className="rounded-xl p-3 ring-white ring-opacity-60 ring-offset-2  focus:outline-none focus:ring-2">
            {/* NOVO CÓDIGO */}
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                    >
                      Vaga
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Criada
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Status
                    </th>

                    <th
                      scope="col"
                      className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                    >
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {user.history_jobs &&
                    user.history_jobs.map((job) => (
                      <tr key={job._id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-blue-600 sm:pl-6">
                          <Link to={`/jobs/${job._id}`}>{job.title}</Link>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {dateFormatter(job.createdAt)}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {job.status}
                        </td>

                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          {id_user === job.select_candidate && (
                            <p>Você foi Escolhido! 🥳</p>
                          )}

                          {id_user !== job.select_candidate &&
                            job.status === "ABERTA" && (
                              <button
                                onClick={() => handleUnapply(job._id)}
                                className="text-indigo-600 hover:text-indigo-900"
                              >
                                DESISTIR DA VAGA
                              </button>
                            )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}

export default ProfilePage;
