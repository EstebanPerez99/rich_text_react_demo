import Icons from "./Icons";
import RichText from "./RichText";
import RichTextVisualizer from "./RichTextVisualizer";

function App() {
	return (
		<div className='container'>
			<div>
				<button className='button-github'>
					<Icons name='github' style={{ fontSize: "1.2rem" }} />
					<a>View on GitHub</a>
				</button>
			</div>
			<header>
				<div className='header-section'>
					<h1 className='title'>Rich Text Demo</h1>
					<p className='subtitle'>
						By:{" "}
						<a
							href='https://x.com/estebanpm__'
							target='_blank'
							rel='noopener noreferrer'
						>
							@estebanpm__
						</a>
					</p>
				</div>
			</header>
			<RichText />
			<p className='preview'>Preview:</p>
			<RichTextVisualizer />
		</div>
	);
}

export default App;
