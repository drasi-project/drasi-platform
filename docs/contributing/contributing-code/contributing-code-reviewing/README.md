# Code reviews

We welcome **any contributor or community-member** to engage with any **any pull-request** on our repository as a reviewer.

This page some contains guidance for:

- Our philosophy as maintainers for code-reviewing
- How to give effective code review feedback
- Responsibilities for the **maintainer** and **reviewer** roles

This is recommended reading for anyone participating in pull-requests either as a submitter or reviewer.

## About code reviews

Code reviews for Drasi take place as part of the pull-request process. See the [documentation on pull-requests](../../contributing-pull-requests/) for information and tips about submitting a pull-request. This means that code reviews take place on [Github](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests) using the pull-request UI and comment system. [Github's documentation](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/reviewing-changes-in-pull-requests/commenting-on-a-pull-request) covers the basics of using the comment system.

Contributors and reviewers might communicate about a pull-request outside Github, for example on a video call or in chat. We encourage this when it is helpful, and we ask that contributors update Github with the important feedback and conclusions reached so that the information is visible to others.

## Philosophy

As maintainers we like the [code review pyramid](https://www.morling.dev/blog/the-code-review-pyramid/) as a guiding principle. 

The most valuable feedback comes from a deep understanding of the project goals and design, and should be applied early in the pull-request process. Surface-level feedback like style suggestions is still valuable, but is most relevant later in the pull-request lifecycle.

Another observation is that the further towards the top of the pyramid the more people are capable of giving feedback. Any software developer should be able to give meaningful feedback on test and documentation quality. In contrast, those most qualified to give deep feedback about a change are the set of people with most experience and knowledge of the project.

We also highly value automation for trivial matters, and use automation to turn debates into trivial matters. You can't argue with the CI.

> :lightbulb: Open questions about behavior and scope should ideally be resolved before an issue becomes a pull-request, but things don't always go to plan. If a code review identifies a misunderstanding or incomplete design for a feature's behavior, it's a good idea to put the pull-request *"on pause"* until we can resolve the ambiguity.

Since we automate most matters of Style, and try to resolve matters of Behavior and Scope before a pull-request then that means the focus of most reviews should be on the Correctness and Design.

## How to give good feedback

Good code review feedback:

- Is on-topic and related to the change being discussed
- Is polite and uses clear and simple language
- Is well-reasoned and explains why a change should be made
- Is appropriate for the maturity of the pull-request

We want code-review feedback to be on-topic and related to the change being made. As a reviewer, if you are unsure about the scope of a change feel free to ask, it is the submitter's job to make the scope clear.

We want code-review feedback to be polite and use relatively simple language. In a public project your comments can be seen by the general public, and will be seen by people for whom English is not their first language. Try to phrase your feedback and questions clearly and simply. If you personally know the person who submitted the pull-request, then avoid being overly casual with your comments. Github is a public space.

We want code-review feedback to be well-reasoned and self-contained. If it helps explain the point you are making, feel free to link to external resources. Avoid making suggestions that provide an alternative without a justification - there are many ways to solve a problem with code, alternatives without a good reasoning are rarely helpful.

We want code-review feedback to be appropriate based on the maturity of the pull-request. Large and complex pull-requests usually go through several iterations, with the first few focused on design. If you are unsure about the maturity of a pull-request please ask the submitter and then give appropriate feedback based on their response.

### Giving praise

It's great to leave positive code-review feedback too! When we talk about code-review feedback the discussion is often focused on the requirements, and ways to give criticism politely. Positive feedback is valuable too and lets contributors know they are on the right track.

### Good feedback: Style

You do not need to spend your time commenting on issues that will be caught by our automation. The set of rules we follow is very minimal and is enforced by tooling already, exceptions are documented. As an example, we expect that all contributors can run `cargo fmt` on their code. If a submitter has not done this, then please point them to the `cargo fmt` documentation instead of personally pointing out every problem.

Beyond this we value consistency with the decisions we've already made. Ideally the code we write is consistent everywhere. Failing that, it should be consistent with the surrounding components.

Outside of these expectations, please feel free to make style suggestions if you think the code could be clearer. If the submitter has a good reason for doing it the way they are, and rejects your feedback then please consider: *"Is someone credibly going to make a mistake in the future based on this decision?"* before continuing to push the issue. We want the project to be approachable for new contributors. We do not want to frustrate people with unnecessary ceremony.

### Good feedback: Correctness

Review feedback for correctness should focus on the following points:

- Does the code work as advertised?
- Do the tests being added ensure that the code will continue to work as advertised?

---

If you're new to code-reviewing, a good way to figure this out is to look at the areas of most complexity. Focus on the most complex first. Mentally, try to describe the behavior (or read the documentation) of a *"unit"* and then walk through the code and see if your mental model matches. Are there any edge cases? Are there better ways to do it?

Now that you've walked through a *"unit"* of functionality, look at the tests for that *"unit"*. Is there sufficient coverage of the common cases? What about negative cases.

This is a basic recipe to follow so you can give good feedback without familiarity with the codebase or overall architecture.

----

As you're reviewing, here's a checklist of things to look for in most code:

- What errors can occur and how are they reported?
- What are the dependencies? How are errors from dependencies handled?
- What standard library or dependency functions are being used, are there more appropriate alternatives?
- What are the pre-conditions and post-conditions of a function? What is the failure mode when the preconditions are violated?
- If the code is highly algorithmic is there are a simpler alternative?
- What kinds of tests should be written?
  - All code should have unit tests. New code should have better-than-average unit test coverage.
  - Code that interacts with external systems should have integration tests or functional tests that verify the interactions between systems.
  - User-visible behaviors and features should have E2E tests if they are significant.

### Good feedback: Design

Review feedback for design should focus on the following points:

- Is this design consistent with the feature's current requirements?
- Is this design consistent with the choices we have made for similar functionality? (does not reinvent the wheel)
- Is there a simpler design that would achieve the same thing?
- Do the names and concepts make sense? Are they consistent?

---

Where possible we want to optimize for correctness, testability, and simplicity in that order. 

---

We include *naming* in the design category because an understanding of the requirements, concepts, and design of a feature is required knowledge for most good naming feedback. For each feature or feature-area we want to define a limited set of named concepts, and then use those concepts to choose the names of software constructs like struct and variable names. 

It is much better for us to leverage user-facing concepts in code than to make up artificial constructs. This way someone with a knowledge of the features can navigate the code based on their background knowledge.

---

As you're reviewing, here's a checklist of things to look for in most code:

- Can the design satisfy all of the functional requirements?
- What are the data-access patterns? How are we limiting the scope and number of data-accesses necessary?
- What are the dependencies? What are the interaction patterns with dependencies?
- Do the names reflect the concepts? Have we created artificial concepts?
- How long are the functions (in terms of code)?
- How testable is the design?

### Good feedback: Behavior

*The decision of how a feature will behave should occur before a pull-request is submitted. This section is guidance for Approvers and Maintainers who have official decision-making responsibility over the project.*

If new feature does not have a clearly-defined behavior that you are **confident** in, please raise your concerns respectfully and ask the submitter to put the pull-request *"on pause"* while the discussion plays out. When doing this please avoid giving other kinds of feedback, as this can send a mixed-signal to the submitter. Apply the `do not merge` label to make the status clear.

The appropriate avenue for discussion is usually an issue. If a large change is submitted without an issue, then it should be paused until we can clarify the expectations.

As a Maintainer, you are responsible for the documentation, quality, and usefulness of the project. If you cannot understand clearly how a feature behaves, then you cannot make a recommendation to users about how and when to use it, and so you cannot support it.

### Good feedback: Scope

*The decision of whether a feature or change is in-scope for the project should occur before a pull-request is submitted. This section is guidance for Approvers and Maintainers who have official decision-making responsibility over the project.*

If you're uncomfortable accepting a pull-request due to its scope or complexity, please raise your concerns respectfully and ask the submitter to put the pull-request *"on pause"* while the discussion plays out. When doing this please avoid giving other kinds of feedback, as this can send a mixed-signal to the submitter. Apply the `do not merge` label to make the status clear.

The appropriate avenue for discussion is usually an issue. If a large change is submitted without an issue, then it should be paused until we can clarify the expectations.

As a Maintainer, you are responsible for the long-term maintenance and stewardship of the project. Don't accept changes you are uncomfortable with. We have limited time and capacity, so everything we say *"yes"* to means that we're saying *"no"* to something else. Saying *"no"* today can preserve your ability to say *"yes"* in the future.


### Code of conduct enforcement

We encourage anyone to report a [code of conduct](../../../CODE_OF_CONDUCT.md) violation if they see one occur. Any code of conduct violation should be reported as per instructions in the link above.

It is **explicitly** a responsibility of approvers and maintainers to report a violation if they suspect one. If a code of conduct violation occurs in a pull-request, follow the instructions [here](https://docs.github.com/en/communities/moderating-comments-and-conversations/managing-disruptive-comments) to minimize the comment and report the violation.

Approvers and maintainers (or anyone else with write-access) **MUST NOT** edit any *other* contributor's comments to maintain trust and transparency. If you do this by accident, please restore the original content and apologize with your own comment. 

