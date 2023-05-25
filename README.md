# TSP-Optimization

After watching the Youtube Channel Reducible's video on the Traveling Salesman Problem (link below), I felt there was a much better method to find the shortest tour.
    https://www.youtube.com/watch?v=GiDsjIBOVoA

There are different interpretations of the TSP but I will be focusing on the Symmetric TSP with the Triangle Inequality assumption. See Reducibles video for further explaination.

After researching the most common approaches to this problem, here are their descriptions below and my thoughts on their ineffeciencies.
    (1) - Brute Force Approach
        Description: Recursively tests each possible path and choosing the minimum distance. 
        
        Solution space: (n-1)! / 2
        
        Evaluation: This is an impossible approach to any cases where n large.

        Notes: I can, however, utilize this approach to verify my algorithm for accuracy where n is small.

    (2) - Nearest Neighbor (NN) Heuristic
        Description: Choosing closest city until all cities are added to the tour.

        Evaluation: Completely pointless.

    (3) - Greedy Heuristic

    (4) - Christofides Algorithm

    (5) - Simulated Annealing

    (6) - Ant Colony Optimization

    (7) - Genetic Algorithm

My Solution - Center of Mass Convergence
    Step 1: Plot points on a cartesian plane.

    Step 2: Take the average of all the x-coordinates and all the y-coordinates. The resulting (x_avg, y_avg) will define our Center of Mass coordinate.

    Step 3: Order cities by their distance from the Center of Mass point (furthest-to-closest)

    Step 4: Connect the furthest 2 cities with a line. Evaluate cities based on the aforementioned order.

    Step 5: To add cities to the path, take the dot product of that city's position and each existing line segment - this will give you that city's distance to each line segment. Choose the smallest resulting value from all evaluated line segments. Eliminate that line segment and add the city to the path in between the cities previously connected by that eliminated line segment.

My Solution - Explanation
I posit that leveraging geometric tenats, my approach can guarantee an optimal path solution with negligible runtime.

    Based on our assumptions, we can deduce that the  minimal path will never cross over itself. This also means, that the resulting path will be an polygon.

    Polygons have a defined area and perimeter. Finding an optimal tour would mean minimizing the perimeter but maximizing the area.

    This phenomena can be seen in nature with spheres which have the minimal surface area (3-D equivalent to perimeter) but maximum volume (3-D equivalent to area).

    Approaches listed above fall into one of two categories:
        A. Guessing - be it random guessing or educated guessing this method does not GUARANTEE the optimal solution.
        B. Solving - the only approach being brute force which is a completed flawed approach.
    
    Determining the optimal path is difficult because all cities must take into account the subsequent paths of all other cities' paths, but each city has no knowledge of paths outside of their own.

    This is where the Center of Mass point comes into play. Since all points have contributed their information to the creation of this point, it serves as a universal reference point from which further evaluations can be predicated.

    My approach can be conceptualized as:
        A circle is define with the centroid set as the Center of Mass point. The radius is the distance of the furthest city from the Center of Mass point. This circle shrinks, upon collision with a city, another circle is generated centered on that city. This circle then expands until it collides with an existing line segment (path between two cities). That city is then added to the path between the two cities that formed that line segment and new line segments are drawn reflecting such. This is repeated until all cities have been added to the path.