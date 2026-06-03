export const applicationReceivedTemplate = (name: string, jobTitle: string) => `
<h2>Hello ${name}</h2>

<p>
Your application for
<strong>${jobTitle}</strong>
has been received.
</p>

<p>Status: APPLIED</p>
`;

export const shortlistedTemplate = (name: string, jobTitle: string) => `
<h2>Congratulations ${name}</h2>

<p>
You have been shortlisted for
<strong>${jobTitle}</strong>.
</p>
`;
