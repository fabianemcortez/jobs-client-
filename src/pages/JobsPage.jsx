import api from "../axios/api";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    async function getJobs() {
      const response = await api.get("/job/all/open");
      setJobs(response.data);
    }

    getJobs();
  }, []);

  console.log(jobs);
  return (
    <>
      <h1 className="text-4xl text-center fint-bols tracking-wider mb-8">
        Ache uma vaga para você!!
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {jobs.map((job) => {
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
                  to={`/jobs/${job._id}`}
                  className="text-sm font-semibold leading-6 text-grey-800 hover:underline"
                >
                  Ver Detalhes &rarr;
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
