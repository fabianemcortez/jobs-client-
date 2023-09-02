import axios from "axios";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function HomePage() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedModel, setSelectedModel] = useState("");

  useEffect(() => {
    async function getJobs() {
      const response = await axios.get("http://localhost:4000/job/all/public");
      setJobs(response.data);
    }
    getJobs();
  }, []);

  function handleSearch(e) {
    setSearch(e.target.value);
  }

  function handleModelFilter(e) {
    setSelectedModel(e.target.value);
  }

  console.log(search);

  return (
    <main>
      <div className="relative mb-6">
        <img
          className="h-32 w-full object-cover rounded-md "
          src="https://images.unsplash.com/photo-1526925539332-aa3b66e35444?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1530&q=80"
        />

        <div className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-60 rounded-md text-center">
          <p className="text-white text-xl font-mono ">
            Sua próxima vaga de emprego
          </p>
        </div>
      </div>

      <div className="mb-4 flex gap-4">
        {/* AQUI VAI O SEARCH BAR E O FILTRO */}

        <input
          type="text"
          placeholder="Busque"
          className="border border-gray-300 rounded-md px-4 py-2 mb-6 w-full"
          value={search}
          onChange={handleSearch}
        />

        <select
          className="border border-gray-300 rounded-md px-4 py-2 mb-6 pr-10"
          onChange={handleModelFilter}
        >
          <option value="">Todos</option>
          <option value="HIBRIDO">Híbrido</option>
          <option value="REMOTO">Remoto</option>
          <option value="PRESENCIAL">Presencial</option>
        </select>
      </div>

      {/* aqui vai mostrar os cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {jobs
          .filter((job) => {
            return job.title.toLowerCase().includes(search.toLowerCase());
          })
          /* PARA QUANDO SELECIONAR TODOS ELE MOSTRAR TODAS AS VAGAS */
          .filter((job) => {
            if (selectedModel === "") {
              return true;
            }
            return job.model === selectedModel;
          })
          .map((job) => {
            return (
              <div
                key={job._id}
                className="bg-white rounded-lg shadow-sm p-3 ring-2 ring-purple-400 ring-offset-2 transform hover:scale-95 transition-transform duration-300"
              >
                <h2 className="font-bold text-lg font-mono">{job.title}</h2>
                <p className="text-xs my-2">Local:{job.city}</p>
                <div className="flex gap-4 my-2 ">
                  <p className="bg-purple-100 px-2 py-1 rounded-md text-xs text-purple-700  ">
                    {job.model}
                  </p>
                  <p className="bg-indigo-100 px-2 py-1 rounded-md text-xs text-indigo-700  ">
                    {" "}
                    Salário R$ {job.salary}
                  </p>
                </div>
                <div className="border-t pt-2">
                  <Link
                    to={`/jobs/public/${job._id}`}
                    className="text-sm font-semibold leading-6 text-grey-800 hover:underline"
                  >
                    {" "}
                    Ver Detalhes &rarr;
                  </Link>
                </div>
              </div>
            );
          })}
      </div>
    </main>
  );
}
