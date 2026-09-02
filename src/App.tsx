/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Innovation from './pages/Innovation';
import Mechanical from './pages/Mechanical';
import Electronics from './pages/Electronics';
import Programming from './pages/Programming';
import Challenges from './pages/Challenges';
import Blog from './pages/Blog';
import Media from './pages/Media';
import Team from './pages/Team';
import Resources from './pages/Resources';
import Admin from './pages/Admin';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="innovation" element={<Innovation />} />
          <Route path="mechanical" element={<Mechanical />} />
          <Route path="electronics" element={<Electronics />} />
          <Route path="programming" element={<Programming />} />
          <Route path="challenges" element={<Challenges />} />
          <Route path="blog" element={<Blog />} />
          <Route path="media" element={<Media />} />
          <Route path="team" element={<Team />} />
          <Route path="resources" element={<Resources />} />
          <Route path="admin" element={<Admin />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
