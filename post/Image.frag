/* Multipass Antialiasing
 * Copyright (C) 2019  Alexander Kraus <nr4@z10.info>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

//Update: removed blur effect

const float fsaa = 121.,
    pi = acos(-1.);

// Bessel function
float j1(float x)
{
    return sin(x)/x/x-cos(x)/x;
}

// Sinc filter kernel
void sinc_kernel(in vec2 n, in float cutoff, out float d)
{
    if(n.x == 0. && n.y == 0.)
        d = cutoff*cutoff/4./pi;
    else
    {
        d = cutoff/2./pi/length(n)*j1(cutoff*length(n));
    }
    d /= length(n)+1.;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec3 col = vec3(0.);
    float bound = sqrt(fsaa)-1.;
   	for(float i = -.5*bound; i<=.5*bound; i+=1.)
        for(float j=-.5*bound; j<=.5*bound; j+=1.)
        {
            float fk;
            sinc_kernel(vec2(i,j)*3./iResolution.xy/max(bound,1.),length(vec2(max(bound,1.))), fk);
            col += texture(iChannel0, fragCoord/iResolution.xy+vec2(i,j)*3./iResolution.xy/max(bound,1.)).xyz*fk;
        }
    col /= fsaa;
    fragColor = vec4(col,1.0);
}
