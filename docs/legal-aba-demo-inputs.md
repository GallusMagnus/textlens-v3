# U.S. Legal (ABA) Demo Inputs

These are simulated inputs for demos, partner conversations, and development testing of the TextLens U.S. Legal (ABA) mode. They are not real incidents and should not be presented as legal advice or factual case material.

Use these to demonstrate that the mode can run a live analysis against mixed legal-profession material: protected speech, institutional duties, identity-targeted allegations, evidentiary uncertainty, response drafting, and human-review prompts.

## 1. Campus Statement After Protest Incident

Metadata:

- Source: Office of Student Affairs
- Platform: Midland University
- Setting: Higher education
- Desired output: Triage memo and response draft
- Policy excerpt: The university prohibits harassment based on religion, ethnicity, national origin, shared ancestry, or association with protected groups. The policy also protects peaceful political protest and viewpoint-neutral debate.

Input:

```text
Midland University affirms the right of students to protest, including criticism of Israel, Zionism, U.S. foreign policy, and university investments. Peaceful advocacy, including boycott or divestment advocacy, is protected by university policy and will not be investigated merely because some members of the campus community strongly disagree with it.

Last Thursday, a coalition of student groups held a permitted protest outside the administration building calling for divestment from companies doing business with Israel. The permit authorized amplified sound from noon to 3 p.m. and required that building entrances, classroom paths, and religious or cultural centers remain accessible. University police reported that most of the event remained peaceful and that several speakers focused on foreign policy, civilian casualties, and university investment policy.

Several Jewish students later reported that a group of demonstrators moved from the administration building toward the Hillel building after the scheduled rally ended. Two students said they were blocked from entering the Hillel building for an evening study session and told that "Zionists are not welcome anywhere on campus unless they denounce Israel." One student reported that she was asked whether she was "one of the campus foreign agents" after another student noticed her Star of David necklace. A photo of the necklace was later posted on a public social-media account with the caption "foreign agents among us."

The protest organizers deny that anyone was physically blocked. They state that their members were chanting near the sidewalk, not controlling access to the building, and that criticism of Zionism is a political position protected by the First Amendment and university policy. They also note that Muslim, Arab, and Palestinian students have reported feeling unsafe when their advocacy is described as hate speech.

The Office of Student Affairs received three bias reports and one complaint from a faculty advisor. The university's public statement said: "Midland condemns all hate and bias. Students who feel uncomfortable should avoid areas where protests are occurring. We will continue to monitor the situation." The statement did not mention the alleged obstruction, the Hillel building, Jewish students, shared ancestry, religious harassment, reporting options, interim measures, or how the university distinguishes protected political advocacy from conduct directed at students because they are Jewish or perceived as connected to Israel.

The Dean of Students has asked for a triage memo identifying what can be said publicly now, what facts must be verified, and what response steps would be consistent with protecting both protest rights and equal access to campus facilities.
```

Expected demo behavior: identify protected political speech while surfacing possible access interference, identity-targeted harassment, evidentiary disputes, and institutional response gaps.

## 2. Law Firm Workplace Memo

Metadata:

- Source: People Operations
- Platform: Hamilton & Reed LLP
- Setting: Law firm workplace
- Desired output: HR/legal review memo
- Policy excerpt: The firm states that it provides equal employment opportunity and reasonable religious accommodations unless doing so would create legally cognizable undue hardship.

Input:

```text
All litigation associates are expected to attend the mandatory client development dinner series every Friday evening this quarter. The series is part of the firm's new "partnership readiness" initiative. Attendance will be considered in year-end reviews because visibility with clients is a key signal of commitment to the firm.

The program was scheduled from 6:30 p.m. to 9:30 p.m. every Friday for twelve weeks. Three associates asked whether they could attend a Sunday or weekday alternative, participate remotely before sundown, or receive credit for other client-development work. Two of the requests came from Jewish associates who observe Shabbat. One came from an employee with a standing religious service obligation at the same time. The practice group leader responded that "no exceptions will be granted because client development requires flexibility" and that the firm "cannot redesign a major program around individual belief systems."

Human Resources circulated this reminder after the requests were raised:

"Several employees have requested religious scheduling accommodations, including Jewish associates observing Shabbat. The firm respects all beliefs, but business development requires flexibility. Employees who cannot attend should understand that partnership readiness will be assessed accordingly. Partners need to see who is fully available when clients expect us to be available."

The same memo added a client-facing appearance rule: "Political symbols and religious items should be kept out of client-facing spaces. This includes kippahs, Stars of David, keffiyehs, campaign pins, union buttons, and other visible items that may distract clients." A senior associate asked whether a small cross necklace, a hijab, or wedding ring would also be covered. HR replied that the rule would be applied with "business judgment" and that people should avoid "items likely to provoke discussion."

Two associates are concerned that declining Friday evening events will be treated as lack of commitment. One partner has already commented that "future leaders find a way to show up." Another partner privately suggested that the Jewish associates could attend the first hour before sundown and "not make this a legal issue." The firm's written accommodation policy says reasonable religious accommodations should be considered unless they create undue hardship, but there is no record of an individualized accommodation discussion, cost estimate, client need, or analysis of alternatives.

The General Counsel has asked for a short HR/legal review memo identifying risk signals, missing facts, questions for managers, and a revised communication that preserves business goals without penalizing religious observance or visible religious identity.
```

Expected demo behavior: surface religious accommodation, visible religious expression, workplace retaliation risk, comparator questions, and missing-facts prompts.

## 3. Bar Association Draft Resolution

Metadata:

- Source: Civil Rights Committee
- Platform: State Bar Working Group
- Setting: Bar association
- Desired output: Policy review
- Policy excerpt: The State Bar supports education on bias, harassment, religious discrimination, professional civility, civil rights, and constitutional protections for speech and association.

Input:

```text
Proposed Resolution of the State Bar Working Group on Antisemitism Education and Professional Responsibility

Whereas lawyers, judges, law students, clients, and members of the public have reported a rise in antisemitic incidents, including threats, harassment, vandalism, Holocaust denial and distortion, conspiracy claims about Jewish power or control, and accusations that Jewish individuals are collectively responsible for the acts of the State of Israel;

Whereas the legal profession has a responsibility to support civil rights, equal access to legal institutions, professional civility, and education about bias affecting religious, ethnic, and ancestry-based communities;

Whereas lawyers should be able to recognize antisemitism when it appears in classic forms, including anti-Jewish conspiracy claims, Holocaust denial and distortion, dual-loyalty accusations, dehumanizing language, exclusion from professional spaces because of Jewish identity, and harassment targeting Jewish lawyers or students because of real or perceived connection to Israel;

Whereas the Bar also recognizes that criticism of Israeli government policy, advocacy for Palestinian rights, support for nonviolent boycotts, debate over Zionism, and debate over constitutional futures are not automatically antisemitic without additional evidence of anti-Jewish hostility, discriminatory treatment, threats, exclusion, or identity-based harassment;

Resolved, that the State Bar should create continuing legal education programming to help lawyers distinguish protected political speech from antisemitic conduct, discriminatory harassment, or professional exclusion;

Resolved, that the program should avoid using any definition or framework as a speech code and should instead present multiple sources as educational tools, including ABA policy, civil-rights guidance on shared ancestry and religious discrimination, and widely discussed antisemitism frameworks with their limits and guardrails;

Resolved, that the Bar should convene CLE sessions, publish a short resource guide, and invite Jewish, Muslim, Arab, Palestinian, Israeli, civil-rights, First Amendment, education-law, employment-law, and professional-responsibility voices to participate;

Resolved, that the resource guide should include practical scenarios for law firms, law schools, courts, bar events, and client intake, including when a lawyer or student is asked to denounce Israel as a condition of participation, when a workplace event conflicts with religious observance, when political advocacy is mistakenly treated as harassment, and when identity-targeted conduct is dismissed as mere political disagreement;

Resolved, that the State Bar should make clear that education about antisemitism is compatible with vigorous debate, viewpoint neutrality, anti-discrimination obligations, and concern for other affected communities.
```

Expected demo behavior: show low concern, strong ABA alignment, protected-speech guardrails, and inclusive implementation design.

## 4. K-12 Parent Complaint

Metadata:

- Source: Parent Email
- Platform: Oak Valley Public Schools
- Setting: K-12 school
- Desired output: Incident triage and next steps
- Policy excerpt: The district prohibits harassment based on race, color, national origin, religion, ancestry, ethnicity, and shared ancestry. The district also protects age-appropriate discussion of current events.

Input:

```text
Dear Principal Morales,

I am writing because my daughter came home upset after a classroom discussion about the Middle East in her ninth-grade civics class. The teacher had assigned students to discuss how schools should handle difficult international issues while respecting classmates. I support students learning about hard topics. I am not asking the school to punish political opinions or prevent students from criticizing governments, including Israel.

During the discussion, one student reportedly said that Jewish students should be "made to answer for what Israel does" before being allowed to speak about discrimination. Another student asked my daughter whether her family "supports the killing" and said she should not speak about prejudice unless she first denounced Zionism. My daughter says she tried to explain that she is Jewish, not a spokesperson for a foreign government. She says the teacher moved on without addressing the comments directly.

After class, several students continued the discussion in a group chat used for the civics project. One message said, "Ask the Zionists in class why they think they get special treatment." Another posted a screenshot of my daughter's project profile with a Star of David sticker visible on her laptop. My daughter did not respond in the chat. She skipped the next civics class because she was embarrassed and did not know whether the teacher would intervene.

The school later sent a general email saying that students may express strong views on international affairs and that families should encourage resilience. The email did not mention antisemitism, shared ancestry, religious harassment, reporting options, whether the classroom incident would be reviewed, or whether teachers were given guidance on how to distinguish political speech from identity-targeted harassment.

I understand that the school must protect student speech and cannot treat all criticism of Israel as antisemitism. I am asking the school to explain what steps it will take when Jewish students are told they must answer for Israel before they can participate in class. I would also like to know whether the district's policy on harassment based on religion, ancestry, ethnicity, or national origin applies to this incident, who will review the group-chat messages, and what support will be offered so my daughter can return to class without being singled out.

Please confirm receipt of this complaint, identify the reporting process, and tell us when we can expect a response.
```

Expected demo behavior: separate protected political speech from alleged identity-targeted conduct, evidentiary uncertainty, school response gaps, and practical next steps.
