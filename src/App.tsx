import { useEffect, useState } from 'react';
import './App.css';

function createJobURL(id: number) {
  return `https://hacker-news.firebaseio.com/v0/item/${id}.json`;
}

function createHNPostURL(id: number) {
  return `https://news.ycombinator.com/item?id=${id}`;
}

interface JobResponse {
  by: string;
  id: number;
  score: number;
  time: number;
  title: string;
  type: string;
  url: string;
}

interface Job {
  companyName: string;
  id: number;
  description: string;
  date: Date;
  url: string;
}

const JOB_STORIES_URL = 'https://hacker-news.firebaseio.com/v0/jobstories.json';

let ids: number[];

async function fetchJobs(
  jobsCount: number,
  offset: number,
): Promise<JobResponse[]> {
  ids =
    ids ||
    ((await fetch(JOB_STORIES_URL).then((res) => res.json())) as number[]);
  const idsToFetch = ids.slice(offset, offset + jobsCount);
  return (await Promise.all(
    idsToFetch
      .map(createJobURL)
      .map((jobURL) => fetch(jobURL).then((res) => res.json())),
  )) as JobResponse[];
}

const JOB_RESPONSE_RE = /(is )?(rebuilding|hiring|looking for)/i;

function formatJobs(jobResponses: JobResponse[]): Job[] {
  return jobResponses.map((jobResponse) => {
    const indexOfKeyword = jobResponse.title.search(JOB_RESPONSE_RE);
    const companyName = jobResponse.title.slice(0, indexOfKeyword).trim();
    const description = jobResponse.title.slice(indexOfKeyword);
    return {
      companyName,
      description,
      id: jobResponse.id,
      date: new Date(jobResponse.time * 1000),
      url: jobResponse.url,
    };
  });
}
type JobCardProps = {
  job: Job;
};

function JobCard({ job }: JobCardProps) {
  const { companyName, description, date, url, id } = job;
  return (
    <a
      href={url || createHNPostURL(id)}
      className="card"
      target="_blank"
      rel="noreferrer nofollow"
    >
      <div className="card__company-name">{companyName}</div>
      <div className="card__description">{description}</div>
      <div className="card__date">{date.toLocaleDateString('en-US')}</div>
    </a>
  );
}

const INITIAL_JOB_COUNT = 9;
const LOAD_MORE_JOB_COUNT = 6;

export default function App() {
  const [jobs, setJobs] = useState<Job[] | null>(null);
  const loadMore = async () => {
    if (!jobs) {
      return;
    }

    const newJobs = formatJobs(
      await fetchJobs(LOAD_MORE_JOB_COUNT, jobs.length),
    );
    setJobs([...jobs, ...newJobs]);
  };

  useEffect(() => {
    void (async () => {
      setJobs(formatJobs(await fetchJobs(INITIAL_JOB_COUNT, 0)));
    })();
  }, []);

  if (!jobs) {
    return null;
  }

  return (
    <main className="main">
      <div className="grid">
        {jobs.map((job) => (
          <JobCard job={job} key={job.id} />
        ))}
      </div>
      <button onClick={loadMore}>Load more</button>
    </main>
  );
}
