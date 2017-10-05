/**
* Set some changing color extravaganza!
* Note that the color is a 4D Float
* Vector, R,G,B and A and each part
* runs from 0.0 to 1.0
*/
uniform float time;

void main() {
gl_FragColor = vec4(0.5 + 0.3*sin(time),  
                    0.5 + 0.3*cos(time), 
                    0.5 + 0.2*sin(time), 
                    1.0);
}