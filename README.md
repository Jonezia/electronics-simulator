# Electronics Simulator

A logic gate simulator made using ReactJS and SnapSVG.

How to use:
- Click a component from the component bar on the left.
- The components searchbar will return components whose names start with the input (not case-sensitive).
- Click a blank space on the paper to add that component to the paper.
- Click on the junctions on either side of a component to begin creating a connection. Move the mouse and click on another junction to create a connection. The same connection cannot be made twice. A junction cannot be connected to itself.
- To delete a connection, click on one of the junctions, then the other junction.
- Click the New button on the toolbar above to clear the paper.

Strange things may happen if you connect components in a strange way. If you cause an infinite feeback loop, it is likely the app will crash due to stack overflow, as the values of components are calculated recursively.
All SVG elements created by me.